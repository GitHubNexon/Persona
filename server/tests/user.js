const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { faker } = require("@faker-js/faker");
const OUTPUT_PATH = path.resolve(__dirname, "../json/users1.json");
const User = require("../models/userModel");
const { generateHash } = require("../controllers/authController");

faker.locale = "en_PH";

const getRandomEnum = (array) =>
  array[Math.floor(Math.random() * array.length)];

const generateFullName = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleName = faker.person.middleName();
  return { firstName, lastName, middleName };
};

const generatePhilippineAddress = () => ({
  street: faker.location.streetAddress(),
  city: faker.helpers.arrayElement([
    "Quezon City",
    "Manila",
    "Makati",
    "Pasig",
    "Taguig",
    "Caloocan",
    "Parañaque",
    "Pasay",
    "Mandaluyong",
    "Las Piñas",
    "Malabon",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "San Juan",
    "Valenzuela",
  ]),
  province: "Metro Manila",
  country: "Philippines",
  postalCode: faker.location.zipCode("1####"),
});

const generateEducation = () => ({
  Elementary: {
    name: faker.company.name() + " Elementary School",
    yearGraduated: faker.number.int({ min: 1990, max: 2005 }),
  },
  HighSchool: {
    name: faker.company.name() + " High School",
    yearGraduated: faker.number.int({ min: 2005, max: 2010 }),
  },
  College: {
    name: faker.company.name() + " University",
    yearGraduated: faker.number.int({ min: 2010, max: 2020 }),
  },
});

const generateEmployeeRecord = () => {
  const startDate = faker.date.past({ years: 10 });
  const endDate = faker.date.between({ from: startDate, to: new Date() });

  return {
    companyName: faker.company.name(),
    position: faker.person.jobTitle(),
    startDate: moment(startDate).format("YYYY-MM-DD"),
    endDate: moment(endDate).format("YYYY-MM-DD"),
    salary: faker.number.int({ min: 15000, max: 100000 }),
  };
};

const generateGovernmentIds = () => ({
  sss: faker.string.uuid(),
  pagIbig: faker.string.uuid(),
  philHealth: faker.string.uuid(),
  tin: faker.string.uuid(),
  passportNo: faker.string.uuid(),
  driversLicense: faker.string.uuid(),
  postalId: faker.string.uuid(),
  votersId: faker.string.uuid(),
  nbi: faker.string.uuid(),
  policeClearance: faker.string.uuid(),
  barangayClearance: faker.string.uuid(),
});

const now = moment().format("YYYY-MM-DDTHH:mm:ssZ");

const generateUser = async () => {
  const name = generateFullName();
  const fullName = `${name.firstName}${name.middleName[0]}${name.lastName}`;
  const username = "@" + fullName.toLowerCase();

  const birthDate = faker.date.between({
    from: "1970-01-01",
    to: "2003-12-31",
  });
  const dateHired = faker.date.past({ years: 5 });

  const hashedPassword = await generateHash("@Test321");

  return {
    basicInfo: {
      ...name,
      birthDate: moment(birthDate).format("YYYY-MM-DD"),
      height: faker.number.int({ min: 150, max: 200 }),
      weight: faker.number.int({ min: 50, max: 100 }),
      spouse: faker.person.fullName(),
      namesOfChildren: [faker.person.firstName(), faker.person.firstName()],
      maritalStatus: getRandomEnum([
        "Single",
        "Married",
        "Divorced",
        "Widowed",
        "Separated",
      ]),
      gender: getRandomEnum(["Male", "Female", "Other"]),
      profileImage: faker.image.avatar(),
    },
    contactInfo: {
      address: generatePhilippineAddress(),
      contactNumber: "09" + faker.phone.number("#########"),
      emergencyContact: {
        name: faker.person.fullName(),
        number: "09" + faker.phone.number("#########"),
      },
    },
    educationInfo: generateEducation(),
    employeeRecords: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      generateEmployeeRecord
    ),
    governmentInfo: generateGovernmentIds(),
    employeeInfo: {
      employeeId: faker.string.uuid(),
      position: faker.person.jobTitle(),
      department: faker.commerce.department(),
      dateHired: moment(dateHired).format("YYYY-MM-DD"),
      employmentStatus: getRandomEnum([
        "Active",
        "Inactive",
        "On Leave",
        "Terminated",
      ]),
    },
    username,
    email: `${fullName.toLowerCase()}@mail.com`,
    password: hashedPassword,
    userType: "Employee",
    failedAttempts: 0,
    lockoutUntil: null,
    status: {
      isDeleted: false,
      isArchived: false,
    },
    createdAt: now,
    updatedAt: now,
    __v: 0,
  };
};

// Run it all in an async IIFE
(async () => {
  const users = await Promise.all(
    Array.from({ length: 30 }, () => generateUser())
  );

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(users, null, 2), "utf-8");
  console.log(`✅ Generated ${users.length} users and saved to ${OUTPUT_PATH}`);
})();
