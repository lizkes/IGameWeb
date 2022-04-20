import { useCallback, useMemo, useState, FC } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Typography,
  Button,
} from "@mui/material";
import {
  LockOutlined,
  LockOpen,
  ArrowForwardIosSharp,
  ErrorOutline,
} from "@mui/icons-material";
import { green, red } from "@mui/material/colors";

import { useStore, useSnackbar } from "src/hooks";
import { useUserInfoQuery } from "src/apis/user";
import { useResourceBriefInfosQuery } from "src/apis/resource";
import { expToLevel } from "src/utils/exp";
import { handleAxiosError } from "src/utils/error";
import NormalSkeleton from "src/components/NormalSkeleton";

const chipStyle = {
  cursor: "pointer",
  transition: "all 150ms",
  "&:hover": {
    filter: "brightness(75%)",
  },
};

type Props = {
  appId: number;
};

const ResourceContainer: FC<Props> = ({ appId }) => {
  const sendSnackbar = useSnackbar();
  const userId = useStore((store) => store.userId);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const accordionHandleChange = useCallback(
    (index: number) => (_: any, newExpanded: Boolean) => {
      setExpandedIndex(newExpanded ? index : -1);
    },
    []
  );

  // 获取资源的简略信息
  const resourceBriefInfosQuery = useResourceBriefInfosQuery(
    {
      offset: 0,
      limit: 10,
      appId: appId,
    },
    {
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取资源信息失败", errorInfo.content, "error");
      },
    }
  );
  // 获取当前用户信息
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
  // 处理获取数据
  const userExp = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data.exp;
    }
    return 0;
  }, [userInfoQuery.data]);
  const resourceBriefInfos = useMemo(() => {
    if (resourceBriefInfosQuery.data) {
      return [...resourceBriefInfosQuery.data.data].sort((r1, r2) =>
        // 倒序排序
        r1.version < r2.version ? 1 : r1.version > r2.version ? -1 : 0
      );
    }
    return null;
  }, [resourceBriefInfosQuery.data]);

  // 返回页面
  return (
    <Box id="ResourceContainer">
      {resourceBriefInfosQuery.isLoading || userInfoQuery.isLoading ? (
        <NormalSkeleton paddingTop="500px" />
      ) : userInfoQuery.error === null && resourceBriefInfos !== null ? (
        resourceBriefInfos.map((r, index) => (
          <Accordion
            expanded={expandedIndex === index}
            onChange={accordionHandleChange(index)}
            key={r.id}
            TransitionProps={{
              mountOnEnter: true,
            }}
            sx={{
              marginBottom: "16px",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ArrowForwardIosSharp
                  sx={{
                    transform: "rotate(-90deg)",
                  }}
                />
              }
              sx={{
                backgroundColor: "#333333",
                borderRadius: "8px",
                opacity: expandedIndex === index ? "100%" : "70%",
                "&:hover": {
                  opacity: "100%",
                },
                transition: "all 150ms",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: {
                      default: "1.4rem",
                      large: "1.6rem",
                    },
                    lineHeight: "1.5",
                    display: "inline",
                  }}
                >
                  {r.name}
                </Typography>
                <Chip
                  component="span"
                  icon={
                    r.allowed_exp > userExp ? <LockOutlined /> : <LockOpen />
                  }
                  sx={{
                    ...chipStyle,
                    paddingLeft: "2px",
                    marginLeft: "8px",
                    verticalAlign: "baseline",
                    backgroundColor:
                      r.allowed_exp > userExp ? red.A700 : green[600],
                    "& .MuiChip-label": {
                      padding: "2px 8px 0 6px",
                    },
                  }}
                  size="small"
                  label={
                    r.allowed_exp && r.allowed_exp !== 0
                      ? `${expToLevel(r.allowed_exp)}级用户`
                      : "所有人"
                  }
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "16px",
              }}
            >
              {r.allowed_exp > userExp ? (
                <Box
                  sx={{
                    margin: "0 auto",
                    maxWidth: "800px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: {
                      default: "24px 8px",
                      large: "24px 16px",
                    },
                  }}
                >
                  {userId ? (
                    <>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: {
                            default: "1.3rem",
                            large: "1.5rem",
                          },
                          lineHeight: "1.5",
                          textAlign: "center",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {`${expToLevel(r.allowed_exp)}级以上用户才能浏览
                        开通会员可以无视等级限制`}
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ marginTop: "16px", width: "100px" }}
                        onClick={() => {
                          navigate("/buy-vip");
                        }}
                      >
                        开通会员
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: {
                            default: "1.3rem",
                            large: "1.5rem",
                          },
                          lineHeight: "1.5",
                          textAlign: "center",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {`您目前尚未登录
                        该资源需登录后才能浏览`}
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ marginTop: "16px", width: "100px" }}
                        onClick={() => {
                          navigate("/login", {
                            state: { fromUrl: location.pathname },
                          });
                        }}
                      >
                        登录
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                <ResourceDetail resourceId={r.id} />
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            overflowWrap: "break-word",
            padding: "16px 0",
            color: (t) => t.palette.error.light,
          }}
        >
          <ErrorOutline
            sx={{
              marginRight: "4px",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontSize: {
                default: "1.3rem",
                large: "1.5rem",
              },
              lineHeight: "1.5",
              textAlign: "center",
            }}
          >
            {userInfoQuery.error !== null
              ? handleAxiosError(userInfoQuery.error).content
              : handleAxiosError(resourceBriefInfosQuery.error).content}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResourceContainer;
