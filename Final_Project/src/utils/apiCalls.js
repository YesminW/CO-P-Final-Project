import { formatDate, formatForCSharp } from "./functions";

// const SERVER_URL = "https://proj.ruppin.ac.il/bgroup31/test2/tar1";
const SERVER_URL = "http://localhost:5068";

export async function login(data) {
  try {
    const { ID, password } = data;
    const user = await fetch(`${SERVER_URL}/LogIn/${ID}/${password}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const user_Data = await user.json();
    console.log(user_Data);

    return user_Data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getUserById(user_id) {
  try {
    const user = await fetch(`${SERVER_URL}/GetOneUser/${user_id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const userData = await user.json();
    return userData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getChildByParent(parent_id) {
  try {
    const child = await fetch(`${SERVER_URL}/GetChildByParent/${parent_id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const childData = await child.json();
    return childData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function updateUserById(details) {
  try {
    const { userId, ...rest } = details;
    const user = await fetch(`${SERVER_URL}/updateUser/${userId}`, {
      method: "PUT",
      body: JSON.stringify(rest),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const userData = await user.json();
    return userData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function uploadUserPhoto(data) {
  try {
    const { userId, file } = data;
    const formData = new FormData();
    formData.append("file", file);
    const photo = await fetch(`${SERVER_URL}/UploadUserPhoto/${userId}`, {
      method: "PUT",
      body: formData,
    });
    const photoData = await photo.json();
    return photoData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function UploadChildPhoto(data) {
  try {
    const { userId, file } = data;
    const formData = new FormData();
    formData.append("file", file);
    const photo = await fetch(`${SERVER_URL}/UploadChildPhoto/${userId}`, {
      method: "PUT",
      body: formData,
    });
    const photoData = await photo.json();
    return photoData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function uploadStaffExcel(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const files = await fetch(`${SERVER_URL}/UploadStaffExcel`, {
      method: "POST",
      body: formData,
    });
    const filesData = await files.json();
    return filesData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function uploadParentsExcel(
  file,
  kindergartenNumber,
  currentYear
) {
  try {
    console.log(file, kindergartenNumber, currentYear);

    const formData = new FormData();
    formData.append("file", file);
    const files = await fetch(
      `${SERVER_URL}/UploadParentsExcel/${kindergartenNumber}/${currentYear}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const filesData = await files.json();
    return filesData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function addChildrenByExcel(
  file,
  kindergartenNumber,
  currentYear
) {
  try {
    console.log(file, kindergartenNumber, currentYear);

    const formData = new FormData();
    formData.append("file", file);
    const files = await fetch(
      `${SERVER_URL}/AddChildrenByExcel/${kindergartenNumber}/${currentYear}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const filesData = await files.json();
    return filesData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getMealByKindergardenAndDate(date, kindergartenNumber) {
  try {
    const response = await fetch(
      `${SERVER_URL}/getbydateandkindergarten/${kindergartenNumber}/${formatForCSharp(
        date
      )}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getAllChild() {
  try {
    const response = await fetch(`${SERVER_URL}/AllChild`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getAllTeacher() {
  try {
    const response = await fetch(`${SERVER_URL}/GetAllTeacher`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getAllAssistants() {
  try {
    const response = await fetch(`${SERVER_URL}/GetAllAssistants`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function managerRegisterion(details) {
  try {
    const response = await fetch(`${SERVER_URL}/ManagerRegisterion`, {
      method: "POST",
      body: JSON.stringify(details),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function addKindergarten(KindergartenName, KindergartenAddress) {
  try {
    const response = await fetch(
      `${SERVER_URL}/AddKindergarten/${KindergartenName}/${KindergartenAddress}`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function fetchBirthdays() {
  try {
    const birthdays = await fetch(`${SERVER_URL}/current-month-birthdays`);
    const data = await birthdays.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getAllKindergartens() {
  try {
    const response = await fetch(`${SERVER_URL}/ShowKindergarten`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getAllChildDuty(kindergartenNumber) {
  try {
    const response = await fetch(
      `${SERVER_URL}/getdutyList/${kindergartenNumber}`
    );
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function assignStaffToKindergarten(
  kindergartenNumber,
  currentAcademicYear,
  firstName,
  lastName
) {
  try {
    const data = await fetch(
      `${SERVER_URL}/AssignStaffToKindergarten/${kindergartenNumber}/${currentAcademicYear}/${firstName}/${lastName}`,
      {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }
    );
    const Data = await data.json();
    return Data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getDailyAttendance(date) {
  try {
    const response = await fetch(`${SERVER_URL}/GetDailyAttendance/${date}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function updateChildAttendence(childID, date) {
  try {
    const response = await fetch(
      `${SERVER_URL}/UpdateAttendanceStatus/${childID}/${date}`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getDaySummaryByDate(date, kindergartenNumber) {
  try {
    const response = await fetch(
      `${SERVER_URL}/GetDaySummaryByDate/${date}/${kindergartenNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function uploaspictures(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const files = await fetch(
      `${SERVER_URL}/api/FaceRecognition/ProcessImage`,
      {
        method: "POST",
        body: formData,
      }
    );
    const filesData = await files.json();
    return filesData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
