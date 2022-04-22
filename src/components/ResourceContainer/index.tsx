import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import {
  LockOutlined,
  LockOpen,
  ArrowForwardIosSharp,
} from "@mui/icons-material";
import { useRouter } from "next/router";

import { useStore, useSnackbar } from "src/hooks";
import { useUserInfoQuery } from "src/apis/user";
import { useResourceBriefInfosQuery } from "src/apis/resource";
import { expToLevel } from "src/utils/exp";
import { handleAxiosError } from "src/utils/error";
import { NormalSkeleton, ErrorComponent, MuiLinkButton } from "src/components";

import ResourceDetail from "./ResourceDetail";

type ResourceContainerProps = {
  appId: number;
};
function ResourceContainer({ appId }: ResourceContainerProps) {
  const sendSnackbar = useSnackbar();
  const router = useRouter();
  const userId = useStore((store) => store.userId);
  const setFromUrl = useStore((store) => store.setFromUrl);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const accordionHandleChange = useCallback(
    (index: number) => (_: any, newExpanded: Boolean) => {
      setExpandedIndex(newExpanded ? index : -1);
    },
    []
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
  // 获取资源的简略信息
  const resourceBriefInfosQuery = useResourceBriefInfosQuery({
    offset: 0,
    limit: 10,
    appId: appId,
  });

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
        // 按版本倒序排序
        r1.version < r2.version ? 1 : r1.version > r2.version ? -1 : 0
      );
    }
    return null;
  }, [resourceBriefInfosQuery.data]);

  if (resourceBriefInfosQuery.isLoading) {
    // 返回等待组件
    return (
      <div id="ResourceContainer">
        <NormalSkeleton paddingTop="500px" />
      </div>
    );
  } else if (resourceBriefInfosQuery.isError) {
    // 返回错误组件
    return (
      <div id="ResourceContainer">
        <ErrorComponent
          message="获取资源信息失败"
          reason={handleAxiosError(resourceBriefInfosQuery.error).content}
        />
      </div>
    );
  } else {
    // 返回正常组件
    return (
      <Box id="ResourceContainer">
        {resourceBriefInfos!.map((r, index) => (
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
                    paddingLeft: "2px",
                    marginLeft: "8px",
                    verticalAlign: "baseline",
                    backgroundColor: (t) =>
                      r.allowed_exp > userExp
                        ? t.palette.error.main
                        : t.palette.success.main,
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
                      <MuiLinkButton
                        href="/buy-vip"
                        variant="contained"
                        size="large"
                        style={{ marginTop: "16px", width: "100px" }}
                      >
                        开通会员
                      </MuiLinkButton>
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
                      <MuiLinkButton
                        href="/login"
                        variant="contained"
                        size="large"
                        style={{ marginTop: "16px", width: "100px" }}
                        onClick={() => {
                          setFromUrl(router.pathname);
                        }}
                      >
                        登录
                      </MuiLinkButton>
                    </>
                  )}
                </Box>
              ) : (
                <ResourceDetail resourceId={r.id} />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }
}

export default ResourceContainer;
