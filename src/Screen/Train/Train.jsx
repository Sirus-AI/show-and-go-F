import React from 'react'
import {server} from '../../Server'
import Navbar from '../../Component/Navigation/Navbar'
import { useState ,useEffect} from 'react'
const Train = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [org_id,setOrg_id] =useState('');


  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  const fecthUserOrganisation=async() =>{
    server
    .get(`api/org/user-organisation/`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}',
        },
    })
    .then((response) => {
        
       
        setOrg_id(response.data.org_id);
    })
    .catch((error) => {
        console.log(error);
    });
}

useEffect(() => {
  fecthUserOrganisation();
    
}, []);
  const Train = () =>{
    server.post(`api/face_capture/train/${org_id}/`,{
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': '{{ csrf_token }}',
      }
    },
    )
    .then((response) => {
     console.log(response.data);
    })
  }
  return (
    <div className='train-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='train'>
        <div className="train-button">
          <button onClick={Train}>Start Train </button>
        </div>
      </div>
    </div>
  )
}

export default Train
