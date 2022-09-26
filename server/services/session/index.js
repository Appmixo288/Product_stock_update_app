import {
  createOrUpdateSession,
  getSession,
  removeSession,
} from "../db/session/session.services.js";

class CustomSessionStorage {
  storeCallback = async (session) => {
    try {
      return Promise.resolve(!!(await createOrUpdateSession(session)));
    } catch (err) {
      throw new Error(err);
    }
  };

  loadCallback = async (id) => {
    try {
      const data = await getSession(id);

      if (data) {
        return Promise.resolve(JSON.parse(data.sessionData));
      } else {
        return Promise.resolve(undefined);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  deleteCallback = async (id) => {
    try {
      console.log("33333333333333333333333333333333333333");
      return Promise.resolve(!!(await removeSession(id)));
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default CustomSessionStorage;
