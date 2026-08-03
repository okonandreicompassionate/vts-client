import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch } from "../../../lib/stores/hooks";
import { setAdminToken } from "../stores/auth-slice";
import { paths } from "../../../config/paths";
import {useTenant} from '../../../lib/tenant'


export const useCompleteLogin = () => {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const completeLogin = (token: string) => {
    if (!token) {
      message.error("Login succeeded but no token was returned.");
      return;
    }

    dispatch(setAdminToken(token));
    navigate(paths.admin.dashboard.getHref(orgSlug));
  };

  return completeLogin;
};