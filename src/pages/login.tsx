import {
  useState,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  FC,
} from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Container,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { blue } from "@mui/material/colors";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";

import { useSnackbar, useStore } from "src/hooks";
import { useUserLoginMutation } from "src/apis/user";
import { handleAxiosError } from "src/utils/error";
import { setAccessToken, setRefreshToken } from "src/utils/localStorage";
import VerifyImagePopper from "src/components/VerifyImagePopper";

type BaseState = {
  emailIsError: boolean;
  emailErrorMessage: string;
  passwordIsError: boolean;
  passwordErrorMessage: string;
  passwordIsShow: boolean;
  userLoginRspIsHandled: boolean;
  verifyPopperIsOpened: boolean;
};

const LoginPage: FC = () => {
  const sendSnackbar = useSnackbar();
  const router = useRouter();
  const userId = useStore((store) => store.userId);
  const setUserId = useStore((store) => store.setUserId);

  const [state, setState] = useState<BaseState>({
    emailIsError: false,
    emailErrorMessage: "默认错误",
    passwordIsError: false,
    passwordErrorMessage: "默认错误",
    passwordIsShow: false,
    userLoginRspIsHandled: false,
    verifyPopperIsOpened: false,
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  const emailRegexp = useMemo(
    () =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    []
  );
  const passwordRegexp = useMemo(
    // eslint-disable-next-line no-useless-escape
    () => /^[a-zA-Z0-9!@#$%^&*()_\-+={}\[\]|\\:;"'<>/?,.~`]{8,32}$/,
    []
  );

  const userLoginMutation = useUserLoginMutation();
  // 处理错误
  useEffect(() => {
    if (userLoginMutation.error && !state.userLoginRspIsHandled) {
      const errorInfo = handleAxiosError(userLoginMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          userLoginRspIsHandled: true,
        });
      } else if (errorInfo.code === 1 && errorInfo.cause === "password") {
        passwordInputRef.current!.focus();
        setState({
          ...state,
          passwordIsError: true,
          passwordErrorMessage: errorInfo.content,
          userLoginRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          userLoginRspIsHandled: true,
          verifyPopperIsOpened: true,
        });
      } else {
        setState({
          ...state,
          userLoginRspIsHandled: true,
        });
        sendSnackbar(
          "登录账号失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, state, userLoginMutation.error]);
  // 处理响应
  useEffect(() => {
    if (userLoginMutation.data && !state.userLoginRspIsHandled) {
      setState({
        ...state,
        userLoginRspIsHandled: true,
      });
      const data = userLoginMutation.data.data;
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setUserId(data.user_id);
    }
  }, [setUserId, state, userLoginMutation.data]);

  const loginButtonClick = useCallback(() => {
    if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (state.passwordIsError) {
      passwordInputRef.current!.focus();
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else if (!passwordRegexp.test(passwordInputRef.current!.value)) {
      passwordInputRef.current!.focus();
      setState({
        ...state,
        passwordIsError: true,
        passwordErrorMessage: "只能包含字母，数字与特殊字符，长度8-32位",
      });
    } else {
      setState({
        ...state,
        userLoginRspIsHandled: false,
      });
      userLoginMutation.mutate({
        email: emailInputRef.current!.value,
        password: passwordInputRef.current!.value,
      });
    }
  }, [emailRegexp, passwordRegexp, state, userLoginMutation]);

  // 如果用户已登录，重定向到主页
  useEffect(() => {
    if (userId) {
      router.replace("/");
    }
  }, [userId, router]);

  // 给回车键添加事件处理
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        loginButtonClick();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [loginButtonClick]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 2 }} />
      <Container
        sx={{
          maxWidth: (t) => t.breakpoints.values.lg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: {
            default: "0 32px",
            large: "0 64px",
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            alignSelf: "center",
            marginBottom: "48px",
            fontSize: "2.5rem",
            lineHeight: "1.3rem",
            letterSpacing: "0.01rem",
          }}
        >
          登录
        </Typography>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
          variant="outlined"
          error={state.emailIsError}
        >
          <InputLabel>电子邮箱</InputLabel>
          <OutlinedInput
            autoFocus
            inputRef={emailInputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.emailIsError === true &&
                emailRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  emailIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!emailRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  emailIsError: true,
                  emailErrorMessage: "邮箱地址格式不正确",
                });
              }
            }}
            label="电子邮箱"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.emailIsError ? "visible" : "hidden",
            }}
          >
            {state.emailErrorMessage}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "4px" }}
          variant="outlined"
          error={state.passwordIsError}
        >
          <InputLabel>密码</InputLabel>
          <OutlinedInput
            inputRef={passwordInputRef}
            type={state.passwordIsShow ? "text" : "password"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.passwordIsError === true &&
                passwordRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  passwordIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!passwordRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  passwordIsError: true,
                  passwordErrorMessage:
                    "只能包含字母，数字与特殊字符，长度8-32位",
                });
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setState({
                      ...state,
                      passwordIsShow: !state.passwordIsShow,
                    })
                  }
                  onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
                    event.preventDefault()
                  }
                  edge="end"
                >
                  {state.passwordIsShow ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="密码"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.passwordIsError ? "visible" : "hidden",
            }}
          >
            {state.passwordErrorMessage}
          </FormHelperText>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              margin: "4px 0 0 0",
              color: blue[400],
              userSelect: "none",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            onClick={() => router.replace("/forget")}
          >
            忘记密码?
          </Typography>
          <Typography
            sx={{
              margin: "4px 0",
              color: blue[400],
              userSelect: "none",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            onClick={() => router.replace("/register")}
          >
            注册账号
          </Typography>
        </Box>
        <LoadingButton
          ref={loginButtonRef}
          variant="contained"
          size="large"
          sx={{
            width: "50%",
            minWidth: "16ch",
            alignSelf: "center",
            fontSize: "1rem",
          }}
          loading={userLoginMutation.isLoading}
          onClick={loginButtonClick}
        >
          登录
        </LoadingButton>
        <VerifyImagePopper
          anchorEl={loginButtonRef.current}
          endpoint="/user/login"
          open={state.verifyPopperIsOpened}
          setOpen={(open) =>
            setState({
              ...state,
              verifyPopperIsOpened: open,
            })
          }
        />
      </Container>
      <Box sx={{ flexGrow: 3 }} />
    </Box>
  );
};

export default LoginPage;