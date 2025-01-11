import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
  } from 'firebase/auth';
  import { auth } from './config';
  
  export const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const registerUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };
  
  export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  };
  