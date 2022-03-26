import { useState, useRef, useMemo } from "react";
import { useQueryClient } from "react-query";
import {
  IconButton,
  Typography,
  Box,
  Button,
  Link as MuiLink,
  LinearProgress,
  Chip,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AccountCircle,
  Download,
  ExitToApp,
  Favorite,
  MonetizationOn,
  Sync,
  Visibility,
} from "@mui/icons-material";
import { amber, green, purple, red } from "@mui/material/colors";
import Link from "next/link";

import { useSnackbar, useStore } from "src/hooks";
import { useUserDailyBonusMutation, useUserInfoQuery } from "src/apis/user";
import { handleAxiosError } from "src/utils/error";
import { expToLevel, nextLevelExp } from "src/utils/exp";
import { dateFormat, toDate, isToday, dateToDay } from "src/utils/time";
import { setAccessToken, setRefreshToken } from "src/utils/localStorage";
import CustomPopper from "src/components/CustomPopper";
import FlashingBadge from "src/components/FlashingBadge";
import NormalSkeleton from "src/components/NormalSkeleton";

const AccountButton = () => {
  const queryClient = useQueryClient();
  const sendSnackbar = useSnackbar();
  const userId = useStore((store) => store.userId);
  const setUserId = useStore((store) => store.setUserId);

  const [popperIsOpen, setPopperIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  // 获取当前用户信息
  const userInfoQuery = useUserInfoQuery(
    {
      userId: userId!,
    },
    {
      enabled: userId !== undefined && popperIsOpen,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
        if (errorInfo.code !== 500) {
          // 如果系统没有维护中, 注销用户
          setAccessToken(null);
          setRefreshToken(null);
          setUserId(undefined);
        }
      },
    }
  );
  const userDailyBonusMutation = useUserDailyBonusMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("用户签到失败", errorInfo.content, "error");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userInfo", data.data.user_id]);
      sendSnackbar(
        "用户签到成功",
        `您已连续签到${data.data.count}天
        奖励${data.data.added_exp}点经验
        奖励${data.data.added_coin}个无限币`,
        "success"
      );
    },
  });
  // 处理获取数据
  const userInfo = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data;
    }
    return null;
  }, [userInfoQuery.data]);
  const isDailyBonusToday: boolean = useMemo(() => {
    if (userInfo && userInfo.last_daily_bonus_time) {
      return isToday(toDate(userInfo.last_daily_bonus_time));
    }
    return false;
  }, [userInfo]);
  const [isVip, remainVipDay]: [boolean, number] = useMemo(() => {
    if (userInfo) {
      const vipRole = userInfo.roles.filter((role) => role.role_id === 3)[0];
      if (vipRole) {
        return [true, dateToDay(toDate(vipRole.expire_at!))];
      }
    }
    return [false, 0];
  }, [userInfo]);
  // 返回页面
  return (
    <>
      <FlashingBadge color={userId ? green[600] : red.A700} animation={true}>
        <IconButton
          ref={anchorRef}
          onClick={() => {
            setPopperIsOpen((open) => !open);
          }}
          sx={{
            padding: "8px",
          }}
        >
          <AccountCircle
            shapeRendering="geometricPrecision"
            sx={{
              color: "white",
              height: {
                xs: "1.1em",
                lg: "1.2em",
              },
              width: {
                xs: "1.1em",
                lg: "1.2em",
              },
            }}
          />
        </IconButton>
      </FlashingBadge>
      <CustomPopper
        anchorEl={anchorRef.current}
        isOpen={popperIsOpen}
        closeFn={() => setPopperIsOpen(false)}
        paperSx={{
          padding: "24px",
        }}
        placement="bottom-end"
        transformOrigin="right top"
      >
        {userInfoQuery.isLoading ? (
          <NormalSkeleton width="228px" height="356px" />
        ) : userInfo ? (
          <Box
            sx={{
              width: "228px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                {userInfo.nick_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <Typography>{userInfo.email}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "8px",
              }}
            >
              <Chip
                size="small"
                label={isVip ? "IGame会员" : "普通用户"}
                sx={{
                  cursor: "pointer",
                  transition: "all 150ms",
                  backgroundColor: isVip ? purple[500] : green[600],
                  "&:hover": {
                    filter: "brightness(75%)",
                  },
                }}
              />
              {isVip ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  {remainVipDay}天后到期
                </Typography>
              ) : null}
            </Box>
            <Link href="/buy/vip" passHref>
              <Button
                fullWidth
                component="a"
                variant="contained"
                color="primary"
                sx={{
                  fontSize: "1.1rem",
                }}
                onClick={() => {
                  setPopperIsOpen(false);
                }}
              >
                {isVip ? "会员续期" : "成为会员"}
              </Button>
            </Link>
            <Divider
              sx={{
                margin: "16px 0",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Typography>等级{expToLevel(userInfo.exp)}</Typography>
              <Typography sx={{ fontSize: "0.75rem" }}>
                {userInfo.exp}/{nextLevelExp(userInfo.exp)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              color="primary"
              value={(userInfo.exp / nextLevelExp(userInfo.exp)) * 100}
              sx={{
                marginBottom: "8px",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <MonetizationOn
                  sx={{
                    color: amber[500],
                    marginRight: "2px",
                  }}
                />
                <Typography>{userInfo.coin}</Typography>
              </Box>
              {isDailyBonusToday ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  连续签到 {userInfo.daily_bonus_count} 天
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  上次签到：
                  {userInfo.last_daily_bonus_time
                    ? dateFormat(toDate(userInfo.last_daily_bonus_time), false)
                    : "从未签到"}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <LoadingButton
                fullWidth
                variant="contained"
                color="success"
                disabled={isDailyBonusToday}
                sx={{
                  fontSize: "1.1rem",
                }}
                loading={
                  userDailyBonusMutation.isLoading || userInfoQuery.isLoading
                }
                onClick={() => {
                  userDailyBonusMutation.mutate();
                }}
              >
                {isDailyBonusToday ? "已签到" : "签到"}
              </LoadingButton>
            </Box>
            <Divider
              sx={{
                margin: "16px 0",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<ExitToApp />}
              color="error"
              sx={{
                fontSize: "1.1rem",
              }}
              onClick={() => {
                setPopperIsOpen(false);
                setUserId(undefined);
                setAccessToken(null);
                setRefreshToken(null);
              }}
            >
              注销
            </Button>
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: "1.25rem", marginBottom: "16px" }}>
              登录后您可以：
            </Typography>
            <Box sx={{ display: "flex", marginBottom: "8px" }}>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                }}
              >
                <Visibility color="primary" sx={{ marginRight: "4px" }} />
                <Typography>浏览限制资源</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Download color="primary" sx={{ marginRight: "4px" }} />
                <Typography>下载付费资源</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", marginBottom: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                }}
              >
                <Sync color="primary" sx={{ marginRight: "4px" }} />
                <Typography>同步活动记录</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Favorite color="primary" sx={{ marginRight: "4px" }} />
                <Typography>获取订阅更新</Typography>
              </Box>
            </Box>
            <Link href="/login" passHref>
              <Button
                fullWidth
                component="a"
                variant="contained"
                sx={{ marginBottom: "8px", fontSize: "1.1rem" }}
                onClick={() => {
                  setPopperIsOpen(false);
                }}
              >
                立即登录
              </Button>
            </Link>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography>
                首次使用？
                <Link href="/register" passHref>
                  <MuiLink
                    underline="hover"
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPopperIsOpen(false);
                    }}
                  >
                    点我注册
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </CustomPopper>
    </>
  );
};

export default AccountButton;
