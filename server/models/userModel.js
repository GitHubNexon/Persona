const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isDeleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

const BasicInfoSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  birthDate: { type: Date },
  height: { type: Number, min: 0 },
  weight: { type: Number, min: 0 },
  spouse: { type: String },
  namesOfChildren: { type: [String] },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
  },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  profileImage: { type: String },
});

const ContactInfoSchema = new mongoose.Schema({
  address: { type: mongoose.Schema.Types.Mixed },
  contactNumber: { type: String },
  emergencyContact: { type: mongoose.Schema.Types.Mixed },
});

const EducationInfoSchema = new mongoose.Schema({
  Elementary: {
    name: { type: String },
    yearGraduated: { type: Number },
  },
  HighSchool: {
    name: { type: String },
    yearGraduated: { type: Number },
  },
  College: {
    name: { type: String },
    yearGraduated: { type: Number },
  },
});

const employeeRecordsSchema = new mongoose.Schema({
  companyName: { type: String },
  position: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  salary: { type: Number, min: 0 },
});

const governmentInfoSchema = new mongoose.Schema({
  sss: { type: String },
  pagIbig: { type: String },
  philHealth: { type: String },
  tin: { type: String },
  passportNo: { type: String },
  driversLicense: { type: String },
  postalId: { type: String },
  votersId: { type: String },
  nbi: { type: String },
  policeClearance: { type: String },
  barangayClearance: { type: String },
});

const employeeInfoSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  position: { type: String, required: false },
  department: { type: String, required: false },
  dateHired: { type: Date, required: false },
  employmentStatus: {
    type: String,
    enum: ["Active", "Inactive", "On Leave", "Terminated"],
    default: "Active",
  },
});

const userSchema = new mongoose.Schema(
  {
    // basicInfo: { type: BasicInfoSchema, required: false },
    // contactInfo: { type: ContactInfoSchema, required: false },
    // educationInfo: { type: EducationInfoSchema, required: false },
    // employeeRecords: { type: [employeeRecordsSchema], required: false },
    // governmentInfo: { type: governmentInfoSchema, required: false },
    // employeeInfo: { type: employeeInfoSchema, required: false },
    fullname: { type: String, required: false },
    username: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false },
    userType: {
      type: String,
      required: true,
    },
    // Google OAuth fields
    googleId: { type: String, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    profilePicture: { type: String },
    isVerified: { type: Boolean, default: false },
    failedAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
    status: { type: StatusSchema, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
