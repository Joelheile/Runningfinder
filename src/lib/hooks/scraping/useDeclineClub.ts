import toast from 'react-hot-toast';

const useDeclineClub = (clubId: string) => {
  const declineClub = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Club declined successfully!');
      } else {
        toast.error('Failed to decline club.');
      }
    } catch (error) {
      toast.error('Error declining club.');
    }
  };

  return declineClub;
};

export default useDeclineClub;
