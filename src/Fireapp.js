import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider

} from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { useState } from "react";
import './Fireapp.css';
import { signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth"
import { FacebookAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";




const auth = getAuth(firebaseConfig);


const Fireapp = () => {
  const provider = new GoogleAuthProvider();
  const Fbprovider = new FacebookAuthProvider();
  const Gitprovider = new GithubAuthProvider();

  const [newUser, setNewUser] = useState(false); // create for state useing of toggle . 

  const [user, setUser] = useState({


    userInfo: false,

    name: "",

    email: "",

    Password: "",

    error: "", // use for error message ;

    success: "", // use for success message ;

    photo: ""

  });

  const handleFormSubmit = (e) => {

    /* console.log(user.Email , user.Password);*/
    if (user.Email && user.Password) {


      /*console.log('Submitting')*/

      /* user created with email and password  " code use from firebase website " Authentication WEB then password Authentication */

      createUserWithEmailAndPassword(auth, user.Email, user.Password)

        .then(res => {
          // Signed in 
          //const user = userCredential.user;

          const newUserInfo = { ...user };
          newUserInfo.error = ''; // error message make null ;
          newUserInfo.success = true; // message of user created successfuly ;
          setUser(newUserInfo);
          updateUserInfo(user.name);
          console.log('user info ', res.user);



          //...

        })



        .catch(error => {
          const newUserInfo = { ...user };

          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

        });

    }
    e.preventDefault(); // using this command for not going refreash Enter Webpage 

  }


  const handleChange = (e) => {

    console.log(e.target.name, e.target.value);


    let isFormvalid = true;


    if (e.target.name === 'Email') {

      isFormvalid = /\S+@\S+\.\S+/.test(e.target.value);

      console.log(isFormvalid)


    }


    if (e.target.name === 'Password') {

      const isPasswordValied = e.target.value.length > 6;

      const PasswordHNumber = /\d{1}/.test(e.target.value);

      isFormvalid = isPasswordValied && PasswordHNumber

    }

    if (isFormvalid) {

      const newUserInfo = { ...user };

      newUserInfo[e.target.name] = e.target.value;

      setUser(newUserInfo);

    }



  }
  const handlesigninClick = () => {


    signInWithPopup(auth, provider)

      /*console.log('Click me ');*/

      .then((res) => {
        const { displayName, photoURL, email } = res.user;

        const signedInuser = {

          userInfo: true,
          name: displayName,

          email: email,
          photo: photoURL
        };

        setUser(signedInuser);

        /*console.log(displayName, email, photoURL);*/

      })

      .catch(err => {


      })
  };

  const handlesignoutClick = () => {



    /*console.log('Click sign Out')*/

    signOut(auth)

      .then(res => {

        const signOutUser = {

          userInfo: false,
          name: "",
          email: "",

          photo: ""

        }

        setUser(signOutUser);

      }).catch(err => {

      })
  }
  const updateUserInfo = name => {



    updateProfile(auth.currentUser, {
      displayName: name
    }).then(function () {
      // Profile updated!
      // ...
    }).catch(function (error) {
      // An error occurred
      // ...
      console.log(error)
    });
  }
  const handleFbaccount = () => {

    signInWithPopup(auth, Fbprovider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        console.log('Facebook user Information After Login ', user);


        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //dir
        //const credential = FacebookAuthProvider.credentialFromResult(result);
       // const accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode , errorMessage );

        // The email of the user's account used.
       // const email = error.email;
        // The AuthCredential type that was used.
        //const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  }

  const handleGithub =()=>{

    signInWithPopup(auth, Gitprovider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    setUser(user);
    console.log('Git Hub User', user)

    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);

    console.log(email, credential, errorCode , errorMessage)
    // ...
  });


  }
  return (
    <div className="Info" >


      {
        user.userInfo ? <button onClick={handlesignoutClick}>Sign out</button> : // button make sign-in and make  sign out ;

          <button onClick={handlesigninClick}>Sign-In</button>



      }

      <br />
      <button onClick={handleFbaccount}>Login with Facebook</button>
      <br/>
      <button onClick = {handleGithub}>Login with GitHub</button>

      {

        user.userInfo &&


        <div >

          <p >Welcome , GoogleAuthentication Website , NAME : {user.name}</p>
          <p> Email Address is : {user.email}</p>
          <img src={user.photo} alt="" />



        </div>

      }
      <h1 className="Text"> Our  Authintication System</h1>

      <input type="Checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />

      <label htmlFor="newUser">New user SignIn</label>
      <form onSubmit={handleFormSubmit}>

        {newUser && <input type="text" name="name" onBlur={handleChange} placeholder="Enter Your Name" required />}

        <br />
        <input type="text" name="Email" onBlur={handleChange} placeholder="Enter Your Email" required />
        <br />
        <br />

        <input type="Password" name="Password" onBlur={handleChange} placeholder="Password" required />

        <br />
        <br />


        <input type="Submit" value={newUser ? " Sign-up" : "Sign-in"} />

      </form>

      <p style={{ color: 'red' }}>{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User created Successfuly </p>}
    </div>
  );



};


export default Fireapp;