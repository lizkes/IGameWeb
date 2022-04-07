import {
  useState,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Container,
  Typography,
  Link as MuiLink,
  Box,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";

import { useSnackbar, useStore } from "src/hooks";
import { useVerifyEmailMutation } from "src/apis/email";
import { useUserResetPasswordMutation } from "src/apis/user";
import { handleAxiosError } from "src/utils/error";
import { setAccessToken, setRefreshToken } from "src/utils/localStorage";
import CountDownLoadingButton from "src/components/CountDownLoadingButton";
import VerifyImagePopper from "src/components/VerifyImagePopper";
import { HOME_URL } from "src/variants";

type BaseState = {
  emailIsError: boolean;
  emailErrorMessage: string;
  emailVerifyCodeIsError: boolean;
  emailVerifyCodeErrorMessage: string;
  passwordIsError: boolean;
  passwordIsShow: boolean;
  verifyEmailRspIsHandled: boolean;
  userResetPasswordRspIsHandled: boolean;
  verifyPopper1IsOpened: boolean;
  verifyPopper2IsOpened: boolean;
};

function ForgetPage() {
  const sendSnackbar = useSnackbar();
  const router = useRouter();
  const userId = useStore((store) => store.userId);
  const userLogin = useStore((store) => store.userLogin);

  const [countDownIsRunning, setCountDownIsRunning] = useState(false);

  const [state, setState] = useState<BaseState>({
    emailIsError: false,
    emailErrorMessage: "默认错误",
    emailVerifyCodeIsError: false,
    emailVerifyCodeErrorMessage: "默认错误",
    passwordIsError: false,
    passwordIsShow: false,
    verifyEmailRspIsHandled: false,
    userResetPasswordRspIsHandled: false,
    verifyPopper1IsOpened: false,
    verifyPopper2IsOpened: false,
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailVerifyCodeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailVerifyButtonRef = useRef<HTMLButtonElement>(null);
  const resetPasswordButtonRef = useRef<HTMLButtonElement>(null);

  const emailVerifyCodeRegexp = useMemo(() => /^[0-9]{4}$/, []);
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

  const verifyEmailMutation = useVerifyEmailMutation();
  // 处理错误
  useEffect(() => {
    if (verifyEmailMutation.error && !state.verifyEmailRspIsHandled) {
      const errorInfo = handleAxiosError(verifyEmailMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          verifyEmailRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          verifyEmailRspIsHandled: true,
          verifyPopper1IsOpened: true,
        });
      } else {
        setState({
          ...state,
          verifyEmailRspIsHandled: true,
        });
        sendSnackbar(
          "发送验证邮件失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, verifyEmailMutation.error, state]);
  // 处理响应
  useEffect(() => {
    if (verifyEmailMutation.data && !state.verifyEmailRspIsHandled) {
      setState({
        ...state,
        verifyEmailRspIsHandled: true,
      });
      setCountDownIsRunning(true);
      sendSnackbar(
        "验证邮件发送成功",
        "请查看您邮箱的收件箱或垃圾邮件箱",
        "success"
      );
    }
  }, [sendSnackbar, verifyEmailMutation, state]);

  const userResetPasswordMutation = useUserResetPasswordMutation();
  // 处理错误
  useEffect(() => {
    if (
      userResetPasswordMutation.error &&
      !state.userResetPasswordRspIsHandled
    ) {
      const errorInfo = handleAxiosError(userResetPasswordMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          userResetPasswordRspIsHandled: true,
        });
      } else if (
        errorInfo.code === 1 &&
        errorInfo.cause === "verifyEmailCode"
      ) {
        emailVerifyCodeInputRef.current!.focus();
        setState({
          ...state,
          emailVerifyCodeIsError: true,
          emailVerifyCodeErrorMessage: errorInfo.content,
          userResetPasswordRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          userResetPasswordRspIsHandled: true,
          verifyPopper2IsOpened: true,
        });
      } else {
        setState({
          ...state,
          userResetPasswordRspIsHandled: true,
        });
        sendSnackbar(
          "重置密码失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, userResetPasswordMutation.error, state]);
  // 处理响应
  useEffect(() => {
    if (
      userResetPasswordMutation.data &&
      !state.userResetPasswordRspIsHandled
    ) {
      setState({
        ...state,
        userResetPasswordRspIsHandled: true,
      });
      const data = userResetPasswordMutation.data.data;
      sendSnackbar("重置密码成功", "您将在三秒后自动登录", "success");
      setTimeout(() => {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        userLogin(data.user_id);
      }, 3000);
    }
  }, [sendSnackbar, userResetPasswordMutation.data, state, userLogin]);

  const verifyEmailButtonClick = useCallback(() => {
    if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else {
      setState({
        ...state,
        verifyEmailRspIsHandled: false,
      });
      verifyEmailMutation.mutate({
        emailAddr: emailInputRef.current!.value,
        emailType: "reset_password",
      });
    }
  }, [emailRegexp, state, verifyEmailMutation]);

  const userResetPasswordButtonClick = useCallback(() => {
    if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (state.emailVerifyCodeIsError) {
      emailVerifyCodeInputRef.current!.focus();
    } else if (state.passwordIsError) {
      passwordInputRef.current!.focus();
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else if (
      !emailVerifyCodeRegexp.test(emailVerifyCodeInputRef.current!.value)
    ) {
      emailVerifyCodeInputRef.current!.focus();
      setState({
        ...state,
        emailVerifyCodeIsError: true,
        emailVerifyCodeErrorMessage: "邮箱验证码格式不正确",
      });
    } else if (!passwordRegexp.test(passwordInputRef.current!.value)) {
      passwordInputRef.current!.focus();
      setState({
        ...state,
        passwordIsError: true,
      });
    } else {
      setState({
        ...state,
        userResetPasswordRspIsHandled: false,
      });
      userResetPasswordMutation.mutate({
        email: emailInputRef.current!.value,
        verifyCode: emailVerifyCodeInputRef.current!.value,
        newPassword: passwordInputRef.current!.value,
      });
    }
  }, [
    emailRegexp,
    passwordRegexp,
    emailVerifyCodeRegexp,
    state,
    userResetPasswordMutation,
  ]);

  // 如果用户已登录，重定向到主页
  useEffect(() => {
    if (userId) {
      router.replace(HOME_URL);
    }
  }, [userId, router]);

  // 给回车键添加事件处理
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        userResetPasswordButtonClick();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [userResetPasswordButtonClick]);

  return (
    <>
      <NextSeo
        title="重置密码 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 4 }} />
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: {
              xs: "0 32px",
              sm: "0 64px",
            },
          }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{
              alignSelf: "center",
              fontSize: {
                xs: "2.4rem",
                lg: "2.8rem",
              },
              fontWeight: 400,
              lineHeight: "1.3rem",
              letterSpacing: "0.01rem",
              marginBottom: "56px",
            }}
          >
            重置密码
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
            sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
            variant="outlined"
            error={state.emailVerifyCodeIsError}
          >
            <InputLabel>邮箱验证码</InputLabel>
            <OutlinedInput
              inputRef={emailVerifyCodeInputRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (
                  state.emailVerifyCodeIsError === true &&
                  emailVerifyCodeRegexp.test(event.target.value)
                ) {
                  setState({
                    ...state,
                    emailVerifyCodeIsError: false,
                  });
                }
              }}
              onBlur={(event: FocusEvent<HTMLInputElement>) => {
                if (!emailVerifyCodeRegexp.test(event.target.value)) {
                  setState({
                    ...state,
                    emailVerifyCodeIsError: true,
                    emailVerifyCodeErrorMessage: "邮箱验证码格式不正确",
                  });
                }
              }}
              sx={{
                padding: "0",
                "& .MuiInputAdornment-root": {
                  height: "100%",
                  maxHeight: "100%",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <CountDownLoadingButton
                    ref={emailVerifyButtonRef}
                    variant="contained"
                    sx={{ width: "120px", height: "100%" }}
                    countDownSeconds={60}
                    countDownIsRunning={countDownIsRunning}
                    setCountDownStop={() => setCountDownIsRunning(false)}
                    loading={verifyEmailMutation.isLoading}
                    onClick={verifyEmailButtonClick}
                  >
                    点此获取
                  </CountDownLoadingButton>
                </InputAdornment>
              }
              label="邮箱验证码"
            />
            <FormHelperText
              error
              variant="outlined"
              sx={{
                marginTop: "0px",
                visibility: state.emailVerifyCodeIsError ? "visible" : "hidden",
              }}
            >
              {state.emailVerifyCodeErrorMessage}
            </FormHelperText>
          </FormControl>
          <FormControl
            sx={{ width: "100%", minWidth: "25ch", marginBottom: "4px" }}
            variant="outlined"
            error={state.passwordIsError}
          >
            <InputLabel>新密码</InputLabel>
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
              label="新密码"
            />
            <FormHelperText
              error
              variant="outlined"
              sx={{
                marginTop: "0px",
                visibility: state.passwordIsError ? "visible" : "hidden",
              }}
            >
              只能包含字母，数字与特殊字符，长度8-32位
            </FormHelperText>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              flexDirection: "row",
              marginBottom: "16px",
            }}
          >
            <Link href="/login" passHref>
              <MuiLink
                underline="hover"
                sx={{
                  margin: "4px 0 0 0",
                  cursor: "pointer",
                }}
              >
                已有账号，直接登录{">"}
              </MuiLink>
            </Link>
          </Box>
          <LoadingButton
            ref={resetPasswordButtonRef}
            variant="contained"
            size="large"
            sx={{
              width: "40%",
              minWidth: "16ch",
              alignSelf: "center",
              fontSize: "1rem",
            }}
            loading={userResetPasswordMutation.isLoading}
            onClick={userResetPasswordButtonClick}
          >
            重置
          </LoadingButton>
          <VerifyImagePopper
            anchorEl={emailVerifyButtonRef.current}
            endpoint="/email/verify"
            open={state.verifyPopper1IsOpened}
            setOpen={(open) =>
              setState({
                ...state,
                verifyPopper1IsOpened: open,
              })
            }
          />
          <VerifyImagePopper
            anchorEl={resetPasswordButtonRef.current}
            endpoint="/user/reset_password"
            open={state.verifyPopper2IsOpened}
            setOpen={(open) =>
              setState({
                ...state,
                verifyPopper2IsOpened: open,
              })
            }
          />
        </Container>
        <Box sx={{ flexGrow: 5 }} />
      </Box>
    </>
  );
}

export default ForgetPage;
