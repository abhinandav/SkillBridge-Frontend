import {jwtDecode} from "jwt-decode";
import axios from 'axios';


const baseURL = 'https://skillbridge.store';

const updateAdminToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  console.log('working');

  try {
      const res = await axios.post(baseURL + '/api/accounts/token/refresh/', {
          'refresh': refreshToken
      });

      if (res.status === 200) {
          console.log('200');
          console.log(res.data)
          const newAccessToken = res.data.access;
          localStorage.setItem('access', newAccessToken);
          console.log('new===', newAccessToken);
          localStorage.setItem('refresh', res.data.refresh);
          return true;
      } else {
          return false;
      }

  } catch (error) {
      console.error('Error updating access token:', error);
      return false;
  }
};


const fetchisAdmin = async () => {
    const token = localStorage.getItem('access');
   
    
    try {
        const res = await axios.get(baseURL + '/api/accounts/user/details/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
  
         console.log('issuperuser-isauthadmin',res.data.is_superuser);
        return res.data.is_superuser;
  
    } catch (error) {
        return false;
    }
  };
  



const isAuthAdmin = async () => {
    const accessToken = localStorage.getItem("access");
    console.log('access----',accessToken);

    if (!accessToken) {
        return { name: null, isAuthenticated: false, isAdmin: false };
    }

    const currentTime = Date.now() / 1000;

    let decoded = jwtDecode(accessToken);
    console.log(decoded.exp - currentTime);


    if (decoded.exp > currentTime) {
        let checkAdmin = await fetchisAdmin(); 
        return { name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin };
    } else {
        const updateSuccess = await updateAdminToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let checkAdmin = await fetchisAdmin(); 
            return { name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin };
        } else {
            return { name: null, isAuthenticated: false, isAdmin: false };
        }
    }
};

export default isAuthAdmin;










// import {jwtDecode} from "jwt-decode";
// import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8000';

// const updateAdminToken = async () => {
//     const refreshToken = localStorage.getItem("refresh");
//     console.log('working........');

//     try {
//         const res = await axios.post(baseURL + '/api/accounts/token/refresh/', {
//             'refresh': refreshToken
//         });

//         if (res.status === 200) {
//           console.log('status 200');
//             localStorage.setItem('access', res.data.access_token);
//             localStorage.setItem('refresh', res.data.refresh_token);
//             return true;
            
//         } else {
//           console.log('false');
//             return false;
//         }

//     } catch (error) {
//         return false;
//     }
// };



// const fetchisAdmin = async () => {
//   const token = localStorage.getItem('access');
 
  
//   try {
//       const res = await axios.get(baseURL + '/api/accounts/user/details/', {
//           headers: {
//               'Authorization': `Bearer ${token}`,
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//           }
//       });

//       // console.log('issuperuser-isauthadmin',res.data.is_superuser);
//       return res.data.is_superuser;

//   } catch (error) {
//       return false;
//   }
// };





// const isAuthAdmin = async () => {
//     const accessToken = localStorage.getItem("access");
  
//     if (!accessToken) {
//       return { isAuthenticated: false, isAdmin: false };
//     }
  
//     const currentTime = Date.now() / 1000;
//     let decoded = jwtDecode(accessToken);
  
//     if (decoded.exp > currentTime) {

//       console.log(decoded.exp - currentTime);
  
//       return { isAuthenticated: true, isAdmin:true, user: decoded.username };
//     } else {
//       console.log('expired............')
//       const updateSuccess = await updateAdminToken();


//       if (updateSuccess) {
//         let decoded = jwtDecode(accessToken);
//         let checkAdmin = await fetchisAdmin();
//         console.log('trueeeeee');
//         console.log('updated token',accessToken);

//         return { isAuthenticated: true, isAdmin: true, user: decoded.username };
//       } else {
//         console.log('else faleee....');
//         return { isAuthenticated: false, isAdmin: false };
//       }
//     }
//   };
  

// export default isAuthAdmin;


