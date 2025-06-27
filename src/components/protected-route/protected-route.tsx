import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUser } from '../../services/slices/auth';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/store/selectors';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const location = useLocation();

  useEffect(() => {
    if (!user && !isAuthChecked) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (user && onlyUnAuth) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return children;
};
