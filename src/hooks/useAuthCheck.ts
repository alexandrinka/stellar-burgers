import { useEffect } from 'react';
import { useDispatch, useSelector } from '../services/store';
import { fetchUser } from '../services/slices/auth';
import { userDataSelector } from '../services/store/selectors';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return !!user;
};
