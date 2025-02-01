import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useFetchClubs = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/clubs/unapproved');
        const data = await response.json();
        setClubs(data);
        toast.success('Clubs fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch clubs.');
      }
    };

    fetchClubs();
  }, []);

  return clubs;
};

export default useFetchClubs;
