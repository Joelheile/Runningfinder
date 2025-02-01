import { Club } from '@/lib/types/Club';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useFetchClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchClubs = useCallback(async () => {
    try {
      const response = await fetch('/api/clubs/unapproved');
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      toast.error('Failed to fetch clubs.');
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return { clubs, refetch: fetchClubs };
};

export default useFetchClubs;
