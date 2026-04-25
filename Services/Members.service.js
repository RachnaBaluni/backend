const Player = require("../models/MemberPlayer.model.js");
const Coach = require("../models/MemberCoach.model.js");
const Academy = require("../models/MemberAcademy.model.js");
const District = require("../models/MemberDistrict.model.js"); // Import District model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Register = async (body) => {
  const type = body.type;
  const validGenders = ["Male", "Female", "Other"];
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Updated regex for website to allow formats like www.example.com or example.com
  const websiteRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;

  // List of valid district names for validation
  const validDistricts = [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ];

  switch (type) {
    case "Player":
      const player = {
        name: body.name,
        gender: body.gender,
        number: body.number,
        email: body.email,
        address: body.address,
        experience: body.experience,
        academy: body.academy,
        password: body.password,
      };
      const confirmPlayerPassword = body.confirmPassword;
      if (
        !player.name ||
        !player.gender ||
        !player.number ||
        !player.email ||
        !player.address ||
        !player.experience ||
        !player.password ||
        !confirmPlayerPassword
      )
        throw new Error("All fields are required");

      if (!validGenders.includes(player.gender))
        throw new Error("Gender is not correct");

      if (!phoneRegex.test(player.number.toString()))
        throw new Error("Phone number is not correct");

      if (!emailRegex.test(player.email)) throw new Error("Email is not valid");

      const existingPlayerEmail = await Player.findOne({ email: player.email });
      if (existingPlayerEmail) throw new Error("Email already registered");

      const existingPlayerPhone = await Player.findOne({
        number: player.number,
      });
      if (existingPlayerPhone)
        throw new Error("Phone number already registered");

      if (player.password !== confirmPlayerPassword)
        throw new Error("Passwords do not match");

      if (!passwordRegex.test(player.password)) {
        throw new Error(
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
        );
      }

      const playerSalt = await bcrypt.genSalt(10);
      const hashedPasswordPlayer = await bcrypt.hash(
        player.password,
        playerSalt
      );
      player.password = hashedPasswordPlayer;

      const newPlayer = await Player.create(player);

      return {
        success: true,
        message: "Player registered successfully",
        playerId: newPlayer._id,
      };

    case "Coach":
      const coach = {
        name: body.name,
        dob: body.dob,
        gender: body.gender,
        number: body.number,
        email: body.email,
        address: body.address,
        experience: body.experience,
        academy: body.academy,
        academyPhone: body.academyPhone,
        academyEmail: body.academyEmail,
        password: body.password,
      };
      const coachConfirmPassword = body.confirmPassword;

      // Required fields
      if (
        !coach.name ||
        !coach.gender ||
        !coach.number ||
        !coach.email ||
        !coach.address ||
        coach.experience === undefined ||
        !coach.password
      )
        throw new Error("All required fields must be filled");

      if (!validGenders.includes(coach.gender))
        throw new Error("Gender is not correct");

      if (!phoneRegex.test(coach.number.toString()))
        throw new Error("Phone number is not correct");

      if (!emailRegex.test(coach.email)) throw new Error("Email is not valid");

      // Optional academy email/phone validation
      if (coach.academyEmail && !emailRegex.test(coach.academyEmail))
        throw new Error("Academy email is not valid");
      if (coach.academyPhone && !phoneRegex.test(coach.academyPhone.toString()))
        throw new Error("Academy phone number is not valid");

      // Duplicates
      const coachEmailCheck = await Coach.findOne({ email: coach.email });
      if (coachEmailCheck) throw new Error("Email already registered");

      const coachPhoneCheck = await Coach.findOne({ number: coach.number });
      if (coachPhoneCheck) throw new Error("Phone number already registered");

      if (coach.password !== coachConfirmPassword)
        throw new Error("Passwords do not match");

      if (!passwordRegex.test(coach.password)) {
        throw new Error(
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
        );
      }

      const coachSalt = await bcrypt.genSalt(10);
      const coachHashedPassword = await bcrypt.hash(coach.password, coachSalt);
      coach.password = coachHashedPassword;

      const newCoach = await Coach.create(coach);

      return {
        success: true,
        message: "Coach registered successfully",
        coachId: newCoach._id,
      };

    case "Academy":
      const academy = {
        academyName: body.academyName,
        academyAddress: body.academyAddress,
        contactNumber: body.contactNumber,
        emailAddress: body.emailAddress,
        website: body.website,
        numberOfCoaches: body.numberOfCoaches,
        numberOfPlayers: body.numberOfPlayers,
        registrationNumber: body.registrationNumber,
        password: body.password,
      };
      const confirmAcademyPassword = body.confirmPassword;

      // Required fields for Academy
      if (
        !academy.academyName ||
        !academy.academyAddress ||
        !academy.contactNumber ||
        !academy.emailAddress ||
        academy.numberOfCoaches === undefined ||
        academy.numberOfPlayers === undefined ||
        !academy.password ||
        !confirmAcademyPassword
      )
        throw new Error(
          "All required fields must be filled for Academy registration"
        );

      if (!phoneRegex.test(academy.contactNumber.toString()))
        throw new Error("Academy Contact Number is not correct");

      if (!emailRegex.test(academy.emailAddress))
        throw new Error("Academy Email Address is not valid");

      // Updated: Optional website validation to support www.website.com or website.com
      if (academy.website && !websiteRegex.test(academy.website)) {
        throw new Error(
          "Website URL is invalid. It should be a valid URL like www.example.com or example.com"
        );
      }

      if (
        isNaN(academy.numberOfCoaches) ||
        parseInt(academy.numberOfCoaches) < 0
      ) {
        throw new Error("Number of Coaches must be a non-negative number.");
      }
      if (
        isNaN(academy.numberOfPlayers) ||
        parseInt(academy.numberOfPlayers) < 0
      ) {
        throw new Error("Number of Players must be a non-negative number.");
      }

      // Duplicates for Academy
      const existingAcademyEmail = await Academy.findOne({
        emailAddress: academy.emailAddress,
      });
      if (existingAcademyEmail)
        throw new Error("Academy Email Address already registered");

      const existingAcademyPhone = await Academy.findOne({
        contactNumber: academy.contactNumber,
      });
      if (existingAcademyPhone)
        throw new Error("Academy Contact Number already registered");

      if (academy.password !== confirmAcademyPassword)
        throw new Error("Passwords do not match");

      if (!passwordRegex.test(academy.password)) {
        throw new Error(
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
        );
      }

      const academySalt = await bcrypt.genSalt(10);
      const hashedPasswordAcademy = await bcrypt.hash(
        academy.password,
        academySalt
      );
      academy.password = hashedPasswordAcademy;

      const newAcademy = await Academy.create(academy);

      return {
        success: true,
        message: "Academy registered successfully",
        academyId: newAcademy._id,
      };

    case "District":
      const district = {
        districtName: body.districtName,
        presidentName: body.presidentName,
        presidentEmail: body.presidentEmail,
        presidentPhone: body.presidentPhone,
        secretaryName: body.secretaryName,
        secretaryEmail: body.secretaryEmail,
        secretaryPhone: body.secretaryPhone,
        treasurerName: body.treasurerName,
        treasurerEmail: body.treasurerEmail,
        treasurerPhone: body.treasurerPhone,
        generalContactEmail: body.generalContactEmail,
        generalContactPhone: body.generalContactPhone,
        password: body.password,
      };
      const confirmDistrictPassword = body.confirmPassword;

      // Required fields for District
      if (
        !district.districtName ||
        !district.presidentName ||
        !district.presidentEmail ||
        !district.presidentPhone ||
        !district.secretaryName ||
        !district.secretaryEmail ||
        !district.secretaryPhone ||
        !district.treasurerName ||
        !district.treasurerEmail ||
        !district.treasurerPhone ||
        !district.generalContactEmail ||
        !district.generalContactPhone ||
        !district.password ||
        !confirmDistrictPassword
      ) {
        throw new Error("All fields are required for District registration.");
      }

      // Validate district name against the allowed list
      if (!validDistricts.includes(district.districtName)) {
        throw new Error(
          `Invalid District Name: ${district.districtName}. Must be one of the specified districts.`
        );
      }

      // Email validations
      if (!emailRegex.test(district.presidentEmail))
        throw new Error("President's Email is invalid.");
      if (!emailRegex.test(district.secretaryEmail))
        throw new Error("Secretary's Email is invalid.");
      if (!emailRegex.test(district.treasurerEmail))
        throw new Error("Treasurer's Email is invalid.");
      if (!emailRegex.test(district.generalContactEmail))
        throw new Error("General Contact Email is invalid.");

      // Phone validations
      if (!phoneRegex.test(district.presidentPhone.toString()))
        throw new Error("President's Phone is invalid.");
      if (!phoneRegex.test(district.secretaryPhone.toString()))
        throw new Error("Secretary's Phone is invalid.");
      if (!phoneRegex.test(district.treasurerPhone.toString()))
        throw new Error("Treasurer's Phone is invalid.");
      if (!phoneRegex.test(district.generalContactPhone.toString()))
        throw new Error("General Contact Phone is invalid.");

      // Duplicate checks for District
      const existingDistrictName = await District.findOne({
        districtName: district.districtName,
      });
      if (existingDistrictName)
        throw new Error("District Name already registered.");
      const existingPresidentEmail = await District.findOne({
        presidentEmail: district.presidentEmail,
      });
      if (existingPresidentEmail)
        throw new Error("President's Email already registered.");
      const existingPresidentPhone = await District.findOne({
        presidentPhone: district.presidentPhone,
      });
      if (existingPresidentPhone)
        throw new Error("President's Phone already registered.");
      const existingSecretaryEmail = await District.findOne({
        secretaryEmail: district.secretaryEmail,
      });
      if (existingSecretaryEmail)
        throw new Error("Secretary's Email already registered.");
      const existingSecretaryPhone = await District.findOne({
        secretaryPhone: district.secretaryPhone,
      });
      if (existingSecretaryPhone)
        throw new Error("Secretary's Phone already registered.");
      const existingTreasurerEmail = await District.findOne({
        treasurerEmail: district.treasurerEmail,
      });
      if (existingTreasurerEmail)
        throw new Error("Treasurer's Email already registered.");
      const existingTreasurerPhone = await District.findOne({
        treasurerPhone: district.treasurerPhone,
      });
      if (existingTreasurerPhone)
        throw new Error("Treasurer's Phone already registered.");
      const existingGeneralContactEmail = await District.findOne({
        generalContactEmail: district.generalContactEmail,
      });
      if (existingGeneralContactEmail)
        throw new Error("General Contact Email already registered.");
      const existingGeneralContactPhone = await District.findOne({
        generalContactPhone: district.generalContactPhone,
      });
      if (existingGeneralContactPhone)
        throw new Error("General Contact Phone already registered.");

      if (district.password !== confirmDistrictPassword)
        throw new Error("Passwords do not match");

      if (!passwordRegex.test(district.password)) {
        throw new Error(
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
        );
      }

      const districtSalt = await bcrypt.genSalt(10);
      const hashedPasswordDistrict = await bcrypt.hash(
        district.password,
        districtSalt
      );
      district.password = hashedPasswordDistrict;

      const newDistrict = await District.create(district);

      return {
        success: true,
        message: "District registered successfully",
        districtId: newDistrict._id,
      };

    default:
      throw new Error("Invalid registration type");
  }
};

const Login = async (data) => {
  const { type, identifier, password } = data;

  // Basic validation
  if (!type || !identifier || !password) {
    const error = new Error(
      "Login type, identifier (email/phone), and password are required."
    );
    error.statusCode = 400; // Custom property to indicate HTTP status in controller
    throw error;
  }

  try {
    let Model;
    let queryField1 = null; // Primary identifier field (e.g., email)
    let queryField2 = null; // Secondary identifier field (e.g., phone/number)

    // Determine which Mongoose model to use and what fields to query
    switch (type) {
      case "Player":
        Model = Player;
        queryField1 = "email";
        queryField2 = "number";
        break;
      case "Coach":
        Model = Coach;
        queryField1 = "email";
        queryField2 = "number";
        break;
      case "Academy":
        Model = Academy;
        queryField1 = "emailAddress";
        queryField2 = "contactNumber";
        break;
      case "District":
        Model = District;
        queryField1 = "generalContactEmail";
        queryField2 = "generalContactPhone";
        break;
      default:
        const error = new Error(
          "Invalid login type provided. Please select Player, Coach, Academy, or District."
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Model) {
      const error = new Error(
        "Server configuration error: No model found for the specified login type."
      );
      error.statusCode = 500;
      throw error;
    }

    // Build the query object for finding the user
    const query = {
      $or: [{ [queryField1]: identifier }],
    };
    if (queryField2) {
      query.$or.push({ [queryField2]: identifier });
    }

    const user = await Model.findOne(query);

    if (!user) {
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    // Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    // --- Generate JWT Token ---
    const token = jwt.sign(
      {
        id: user._id,
        type: type,
        identifier: user[queryField1] || user[queryField2],
      },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is available in your env
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Login successful
    // Omit sensitive data like password hash from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      success: true,
      message: `${type} logged in successfully!`,
      user: userResponse, // Return user data (without password)
      token: token, // Return the generated token
    };
  } catch (error) {
    console.error(`Login service error for ${type}:`, error); // Log the full error object
    // If it's a known error from our validation or model lookup
    if (error.statusCode) {
      throw error; // Re-throw with custom status code
    }
    // For unexpected errors, throw a generic server error
    const genericError = new Error(
      "An internal server error occurred during login."
    );
    genericError.statusCode = 500;
    throw genericError;
  }
};

const getMemberDetails = async (id, type) => {
  if (!id || !type) {
    const error = new Error("Member ID and type are required.");
    error.statusCode = 400;
    throw error;
  }

  let Model;
  let identifierField;

  switch (type) {
    case "Player":
      Model = MemberPlayer;
      identifierField = "email";
      break;
    case "Coach":
      Model = Coach;
      identifierField = "email"; // Or "number"
      break;
    case "Academy":
      Model = MemberAcademy;
      identifierField = "emailAddress"; // As per your schema
      break;
    case "District":
      Model = MemberDistrict;
      identifierField = "generalContactEmail"; // As per your schema
      break;
    default:
      const error = new Error("Invalid member type provided.");
      error.statusCode = 400;
      throw error;
  }

  const member = await Model.findById(id).select("-password"); // Fetch by ID, exclude password

  if (!member) {
    const error = new Error(`${type} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const memberData = member.toObject();
  memberData.type = type;

  return memberData;
};

const getAllMembers = async () => {
    const players = await Player.find();
    const coaches = await Coach.find();
    const academies = await Academy.find();
    const districts = await District.find();
    return { players, coaches, academies, districts };
};

const approveMember = async (memberId, memberType) => {
    let Model;
    switch (memberType) {
        case 'Player':
            Model = Player;
            break;
        case 'Coach':
            Model = Coach;
            break;
        case 'Academy':
            Model = Academy;
            break;
        case 'District':
            Model = District;
            break;
        default:
            throw new Error('Invalid member type');
    }

    const member = await Model.findByIdAndUpdate(
        memberId,
        { status: 'Verified' },
        { new: true }
    );

    if (!member) {
        throw new Error('Member not found');
    }

    return member;
};

const getPendingMembers = async () => {
    const players = await Player.find({ status: { $ne: 'Verified' } });
    const coaches = await Coach.find({ status: { $ne: 'Verified' } });
    const academies = await Academy.find({ status: { $ne: 'Verified' } });
    const districts = await District.find({ status: { $ne: 'Verified' } });
    return { players, coaches, academies, districts };
};

const getVerifiedMembers = async () => {
    const players = await Player.find({ status: 'Verified' });
    const coaches = await Coach.find({ status: 'Verified' });
    const academies = await Academy.find({ status: 'Verified' });
    const districts = await District.find({ status: 'Verified' });
    return { players, coaches, academies, districts };
};

const deleteMember = async (memberId, memberType) => {
    let Model;
    switch (memberType) {
        case 'Player':
            Model = Player;
            break;
        case 'Coach':
            Model = Coach;
            break;
        case 'Academy':
            Model = Academy;
            break;
        case 'District':
            Model = District;
            break;
        default:
            throw new Error('Invalid member type');
    }
    const member = await Model.findByIdAndDelete(memberId);
    if (!member) {
        throw new Error('Member not found');
    }
    return member;
};

const removeMember = async (memberId, memberType) => {
    let Model;
    switch (memberType) {
        case 'Player':
            Model = Player;
            break;
        case 'Coach':
            Model = Coach;
            break;
        case 'Academy':
            Model = Academy;
            break;
        case 'District':
            Model = District;
            break;
        default:
            throw new Error('Invalid member type');
    }
    const member = await Model.findByIdAndUpdate(
        memberId,
        { status: 'Removed' },
        { new: true }
    );
    if (!member) {
        throw new Error('Member not found');
    }
    return member;
};

module.exports = { Register, Login, getMemberDetails, getAllMembers, approveMember, getPendingMembers, getVerifiedMembers, deleteMember, removeMember };
