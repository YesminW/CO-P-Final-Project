import { formatDate, formatForCSharp } from "./functions";

// const SERVER_URL = "https://proj.ruppin.ac.il/bgroup31/test2/tar1";
const SERVER_URL = "http://localhost:5068";

export async function login(data) {
  try {
    const { ID, password } = data;
    const user_id = await fetch(`${SERVER_URL}/LogIn/${ID}/${password}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });
    const user_idData = await user_id.json();
    return user_idData;
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
    console.log(Object.fromEntries(formData));
    console.log(userId);

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

export async function addUserByExcel(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const files = await await fetch(`${SERVER_URL}/AddUserByExcel`, {
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

export async function addChildrenByExcel(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const files = await await fetch(`${SERVER_URL}/AddChildrenByExcel`, {
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
