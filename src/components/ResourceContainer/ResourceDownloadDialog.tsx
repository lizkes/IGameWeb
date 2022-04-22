import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  DialogProps,
  CircularProgress,
  Link,
} from "@mui/material";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

import { useStore, useSnackbar } from "src/hooks";
import { useUserInfoQuery } from "src/apis/user";
import { useResourceDownloadUrlMutation } from "src/apis/resource";
import { handleAxiosError } from "src/utils/error";
import { MuiLinkButton } from "src/components";

type Props = DialogProps & {
  resourceId: number;
  resourceName: string;
  cost: number;
  providerGroup: "normal" | "fast";
  open: boolean;
  closeFn: () => void;
};

const ResourceDownloadDialog: FC<Props> = ({
  resourceId,
  resourceName,
  cost,
  providerGroup,
  open,
  closeFn,
  ...props
}) => {
  const sendSnackbar = useSnackbar();
  const router = useRouter();
  const userId = useStore((store) => store.userId);
  const setFromUrl = useStore((store) => store.setFromUrl);
  const queryClient = useQueryClient();
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [downloadConfirmed, setDownloadConfirmeded] = useState<boolean>(
    cost > 0 ? false : true
  );
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  // 获取用户信息
  const userInfoQuery = useUserInfoQuery(
    { userId: userId! },
    {
      enabled: userId !== null,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
      },
    }
  );
  // 获取资源链接
  const resourceUrlMutation = useResourceDownloadUrlMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("获取资源下载链接失败", errorInfo.content, "error");
    },
  });

  // 处理获取数据
  const userInfo = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data;
    }
    return null;
  }, [userInfoQuery.data]);
  const resourceUrlInfo = useMemo(() => {
    if (resourceUrlMutation.data) {
      return resourceUrlMutation.data.data;
    }
    return null;
  }, [resourceUrlMutation.data]);

  useEffect(() => {
    if (downloadConfirmed && !downloadStarted) {
      // 开始下载
      setDownloadStarted(true);
      resourceUrlMutation.mutate({
        resourceId: resourceId,
        providerGroup: providerGroup,
      });
    }
  }, [
    resourceId,
    providerGroup,
    downloadConfirmed,
    downloadStarted,
    resourceUrlMutation,
  ]);
  useEffect(() => {
    if (resourceUrlMutation.isSuccess && !downloadCompleted) {
      downloadLinkRef.current?.click();
      setDownloadCompleted(true);
      if (cost > 0 && userId !== null) {
        // 如果费用大于0，且用户已登录，过期用户信息，从服务器重新获取
        queryClient.invalidateQueries(["userInfo", userId]);
      }
    }
  }, [
    resourceUrlMutation.isSuccess,
    queryClient,
    userId,
    cost,
    downloadCompleted,
  ]);

  const isVip = useMemo(() => {
    if (userInfo) {
      const vipRole = userInfo.roles.filter((role) => role.role_id === 3)[0];
      if (vipRole) {
        return true;
      }
    }
    return false;
  }, [userInfo]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      {...props}
      open={open}
      // 阻止点击外部关闭行为
      onClose={() => {
        return;
      }}
    >
      <DialogTitle
        sx={{
          fontSize: {
            default: "1.3rem",
            large: "1.6rem",
          },
          color: (t) => t.palette.primary.light,
        }}
      >
        {resourceName}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "8px 0",
          }}
        >
          {downloadConfirmed ? (
            resourceUrlMutation.isLoading ? (
              <>
                <Typography
                  sx={{
                    fontSize: {
                      default: "1.2rem",
                      large: "1.3rem",
                    },
                  }}
                >
                  正在获取下载链接，请稍后...
                </Typography>
                <CircularProgress
                  sx={{
                    margin: "16px 0",
                  }}
                />
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: {
                      default: "1.2rem",
                      large: "1.3rem",
                    },
                  }}
                >
                  下载将在几秒后开始...
                </Typography>
                <Typography
                  sx={{
                    marginTop: "2px",
                    fontSize: {
                      default: "0.95rem",
                      large: "1rem",
                    },
                  }}
                >
                  尚未开始？
                  <Link
                    ref={downloadLinkRef}
                    href={resourceUrlInfo?.download_url}
                    underline="hover"
                    rel="noopener noreferrer"
                    target="_blank"
                    download
                  >
                    点此下载
                  </Link>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={closeFn}
                    sx={{
                      padding: {
                        default: "6px 24px",
                        large: "6px 30px",
                      },
                      fontSize: {
                        default: "0.875rem",
                        large: "0.9375rem",
                      },
                    }}
                  >
                    完成
                  </Button>
                </Box>
              </>
            )
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: {
                    default: "1.2rem",
                    large: "1.3rem",
                  },
                  width: "100%",
                  textAlign: "center",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {userInfo
                  ? isVip
                    ? `该资源定价 ${cost} 无限币
                  您是IGame会员，本次下载免费`
                    : `本次下载将消耗 ${cost} 无限币
                您当前拥有 ${userInfo.coin} 无限币`
                  : `本次下载将消耗 ${cost} 无限币
                您需要登录后才能下载`}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={closeFn}
                >
                  返回
                </Button>
                {userInfo ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => setDownloadConfirmeded(true)}
                  >
                    下载
                  </Button>
                ) : (
                  <MuiLinkButton
                    href="/login"
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setFromUrl(router.pathname);
                    }}
                  >
                    登录
                  </MuiLinkButton>
                )}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDownloadDialog;
