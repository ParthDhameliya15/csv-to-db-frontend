import React , {useState, useEffect} from 'react'
import axios from 'axios';

function ModifiedTime() {
    const [lastModifiedTime, setLastModifiedTime] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8001/lastModifiedTime');
          const lastModifiedTime = new Date(response?.data);
          console.log('Last modified time:', lastModifiedTime);
          setLastModifiedTime(lastModifiedTime);
          setError(null); // Reset error state if previous request was successful
        } catch (error) {
          console.error('Error fetching last modified time:', error);
          setError(error.response ? error.response.data : 'Network Error'); // Set error message from response or generic message
          setLastModifiedTime(null); // Clear last modified time on error
        } 
      };
      
  fetchData()
      const intervalId = setInterval(() => {
        fetchData();
      }, 5000);
  
   
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    return (
      <div>
      <h1>Last Modified Time</h1>
      {lastModifiedTime && !error && <p>{lastModifiedTime.toLocaleTimeString()}</p>}
      {error && <p>Error: {error}</p>} {/* Display error message if error state is not null */}
    </div>
    );
  }

export default ModifiedTime