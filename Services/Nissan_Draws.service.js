const mongoose = require("mongoose");
const Nissan_Draws = require("../models/Nissan_Draws.model.js");
const Team = require("../models/Team.model.js");
const OrderOfPlay = require("../models/OrderOfPlay.model");
/* =========================
   CREATE DRAW
   ========================= */
exports.createDrawforEvent = async (eventId) => {
  try {
    await Nissan_Draws.deleteMany({ Event: eventId });

    const teams = await Team.find({ eventId }).sort({ rank: "asc" });
    const numTeams = teams.length;

    if (numTeams < 2) {
      throw new Error("Not enough teams for a draw.");
    }

    const bracketSize = Math.pow(2, Math.ceil(Math.log2(numTeams)));
    const numRounds = Math.log2(bracketSize);

    function buildBracketSlots(n) {
      if (n === 1) return [1];
      const half = buildBracketSlots(n / 2);
      const mirror = half.map((x) => n + 1 - x);
      const out = [];
      for (let i = 0; i < half.length; i++) {
        out.push(half[i]);
        out.push(mirror[i]);
      }
      return out;
    }

    const slots = buildBracketSlots(bracketSize);

    let matches = [];
    let matchNum = 1;

    // ROUND 1
    for (let i = 0; i < slots.length; i += 2) {
      const seedA = slots[i];
      const seedB = slots[i + 1];

      const teamA = seedA <= numTeams ? teams[seedA - 1]._id : null;
      const teamB = seedB <= numTeams ? teams[seedB - 1]._id : null;

      let winner = null;
      let status = "Upcoming";

      if (teamA && !teamB) {
        winner = teamA;
        status = "Completed";
      } else if (teamB && !teamA) {
        winner = teamB;
        status = "Completed";
      }

      matches.push({
        Event: eventId,
        Stage: "Round 1",
        Match_number: matchNum++,
        Team1: teamA,
        Team2: teamB,
        Winner: winner,
        Status: status,
      });
    }

    // NEXT ROUNDS
    let numMatchesInNextRound = bracketSize / 4;
    for (let round = 2; round <= numRounds; round++) {
      for (let i = 0; i < numMatchesInNextRound; i++) {
        matches.push({
          Event: eventId,
          Stage: `Round ${round}`,
          Match_number: i + 1,
          Team1: null,
          Team2: null,
        });
      }
      numMatchesInNextRound /= 2;
    }

    const insertedMatches = await Nissan_Draws.insertMany(matches);

    // propagate BYE winners
    for (const match of insertedMatches) {
      if (match.Winner && match.Status === "Completed") {
        await exports.updateDraw(match._id, {
          Winner: match.Winner,
          Status: "Completed",
        });
      }
    }

    return { message: "Draws created successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

/* =========================
   GET DRAWS
   ========================= */
exports.getDrawsByEvent = async (eventId) => {
  try {
    return await Nissan_Draws.find({ Event: eventId })
      .populate({
        path: "Team1",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate({
        path: "Team2",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate("Winner");
  } catch (error) {
    throw new Error(error.message);
  }
};

/* =========================
   UPDATE DRAW (PROPAGATION)
   ========================= */
exports.updateDraw = async (drawId, updateData) => {
  try {
    const updatedDraw = await Nissan_Draws.findByIdAndUpdate(
      drawId,
      updateData,
      { new: true },
    );

    if (!updatedDraw) return null;

    const currentMatch = updatedDraw;
    const orderOfPlays = await OrderOfPlay.find({
      eventId: currentMatch.Event.toString(),
    });

    const currentRound = parseInt(currentMatch.Stage.replace("Round ", ""));
    const nextStage = `Round ${currentRound + 1}`;
    const nextMatchNumber = Math.ceil(currentMatch.Match_number / 2);

    const slotType = currentMatch.Match_number % 2 !== 0 ? "Team1" : "Team2";

    const nextMatch = await Nissan_Draws.findOne({
      Event: currentMatch.Event,
      Stage: nextStage,
      Match_number: nextMatchNumber,
    });

    if (nextMatch) {
      if (currentMatch.Winner) {
        await Nissan_Draws.findByIdAndUpdate(nextMatch._id, {
          [slotType]: currentMatch.Winner,
        });
      } else {
        await Nissan_Draws.findByIdAndUpdate(nextMatch._id, {
          [slotType]: null,
        });

        if (nextMatch.Winner) {
          await exports.updateDraw(nextMatch._id, {
            Winner: null,
            Status: "Upcoming",
          });
        }
      }
    }

    for (const order of orderOfPlays) {
      let changed = false;

      order.grid = order.grid.map((row) =>
        row.map((cell) => {
          if (!cell?.match) return cell;

          if (cell.match._id.toString() === updatedDraw._id.toString()) {
            changed = true;

            return {
              ...cell,
              match: {
                ...cell.match,
                Winner: updatedDraw.Winner,
                Status: updatedDraw.Status,
              },
            };
          }

          return cell;
        }),
      );

      if (changed) {
        try {
          await order.save();
        } catch (err) {
          console.log("ORDER SAVE ERROR:", err);
          throw err;
        }
      }
    }

    return updatedDraw;
  } catch (error) {
    throw new Error(error.message);
  }
};

/* =========================
   UPDATE MATCHUP (BYE LOGIC)
   ========================= */
exports.updateMatchup = async (matchId, teamField, teamId) => {
  try {
    const match = await Nissan_Draws.findById(matchId);

    match[teamField] = teamId || null;

    let winner = null;
    let status = "Upcoming";

    if (match.Team1 && !match.Team2) {
      winner = match.Team1;
      status = "Completed";
    } else if (match.Team2 && !match.Team1) {
      winner = match.Team2;
      status = "Completed";
    }

    match.Winner = winner;
    match.Status = status;

    await match.save();

    await exports.updateDraw(matchId, {
      Winner: winner,
      Status: status,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

/* =========================
   SWAP MATCHUP (FINAL FIX)
   ========================= */
exports.swapMatchup = async (
  sourceMatchId,
  sourceSlotType,
  targetMatchId,
  targetSlotType,
  draggedTeamId,
  originalTargetTeamId,
) => {
  try {
    const sourceMatch = await Nissan_Draws.findById(sourceMatchId);
    const targetMatch = await Nissan_Draws.findById(targetMatchId);

    if (
      sourceMatch.Status === "Completed" ||
      sourceMatch.Winner ||
      targetMatch.Status === "Completed" ||
      targetMatch.Winner
    ) {
      throw new Error(
        "This match has already been completed. Drag and drop is not allowed.",
      );
    }
    await Nissan_Draws.findByIdAndUpdate(targetMatchId, {
      [targetSlotType]: draggedTeamId || null,
    });

    await Nissan_Draws.findByIdAndUpdate(sourceMatchId, {
      [sourceSlotType]: originalTargetTeamId || null,
    });
    const updatedSourceMatch = await Nissan_Draws.findById(sourceMatchId);
    const updatedTargetMatch = await Nissan_Draws.findById(targetMatchId);

    // SOURCE BYE LOGIC
    let sourceWinner = null;
    let sourceStatus = "Upcoming";

    if (updatedSourceMatch.Team1 && !updatedSourceMatch.Team2) {
      sourceWinner = updatedSourceMatch.Team1;
      sourceStatus = "Completed";
    } else if (updatedSourceMatch.Team2 && !updatedSourceMatch.Team1) {
      sourceWinner = updatedSourceMatch.Team2;
      sourceStatus = "Completed";
    }

    // TARGET BYE LOGIC
    let targetWinner = null;
    let targetStatus = "Upcoming";

    if (updatedTargetMatch.Team1 && !updatedTargetMatch.Team2) {
      targetWinner = updatedTargetMatch.Team1;
      targetStatus = "Completed";
    } else if (updatedTargetMatch.Team2 && !updatedTargetMatch.Team1) {
      targetWinner = updatedTargetMatch.Team2;
      targetStatus = "Completed";
    }

    await exports.updateDraw(sourceMatchId, {
      Winner: sourceWinner,
      Status: sourceStatus,
    });

    await exports.updateDraw(targetMatchId, {
      Winner: targetWinner,
      Status: targetStatus,
    });

    const orderOfPlays = await OrderOfPlay.find({
      eventId: sourceMatch.Event.toString(),
    });
    for (const order of orderOfPlays) {
      let changed = false;

      order.grid = order.grid.map((row) => {
        return row.map((cell) => {
          if (!cell || !cell.match) return cell;

          if (cell.match._id.toString() === sourceMatchId.toString()) {
            changed = true;

            return {
              ...cell,
              match: {
                ...cell.match,
                Team1: updatedSourceMatch.Team1,
                Team2: updatedSourceMatch.Team2,
              },
            };
          }

          if (cell.match._id.toString() === targetMatchId.toString()) {
            changed = true;

            return {
              ...cell,
              match: {
                ...cell.match,
                Team1: updatedTargetMatch.Team1,
                Team2: updatedTargetMatch.Team2,
              },
            };
          }

          return cell;
        });
      });

      if (changed) {
        await order.save();
      }
    }
    console.log("Order Of Play Records:", orderOfPlays.length);
  } catch (error) {
    throw new Error(error.message);
  }
};

/* =========================
   GET ALL DRAWS (ALL EVENTS)
   ========================= */
exports.getAllDraws = async () => {
  try {
    return await Nissan_Draws.find()
      .populate({
        path: "Team1",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate({
        path: "Team2",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate("Winner")
      .populate("Event");
  } catch (error) {
    throw new Error(error.message);
  }
};
