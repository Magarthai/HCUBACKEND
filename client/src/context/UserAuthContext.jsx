import React, { createContext, useContext, useEffect, useState } from 'react';
import {where,doc} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';

import { auth, db } from '../firebase/config';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState(null);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    setUserData(null); // Set userData to null on logout
    return signOut(auth);
  }
  

  const fetchUserData = async () => {
    try {
      if (user && !userData) {
        const usersCollection = collection(db, 'users');
  
        // Create a query to get the document with the specified UID
        const q = query(usersCollection, where('uid', '==', user.uid));
  
        const usersSnapshot = await getDocs(q);
  
        if (!usersSnapshot.empty) {
          const currentUserData = usersSnapshot.docs[0].data();
          setUserData(currentUserData);
          console.log('User Data:', currentUserData);
          console.log(user.uid)
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log('Auth', currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(userData);
    console.log(user);
    if (user && !userData) {
      fetchUserData();
    }
  }, [user]);
  


  return (
    <userAuthContext.Provider value={{ user, userData, logIn, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
