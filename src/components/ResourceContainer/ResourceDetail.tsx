import { useMemo, useState } from "react";
import { Chip, Typography, Button, Divider } from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";

import { useResourceInfoQuery } from "src/apis/resource";
import { handleAxiosError } from "src/utils/error";
import { MarkdownParser, NormalSkeleton, ErrorComponent } from "src/components";

import ResourceDownloadDialog from "./ResourceDownloadDialog";

type Props = {
  resourceId: number;
};

function ResourceDetail({ resourceId }: Props) {
  const [DownloadDialogOpen, setDownloadDialogOpen] = useState(false);

  // 查询API
  const resourceInfoQuery = useResourceInfoQuery({
    resourceId: resourceId,
  });

  // 处理获取数据
  const resourceInfo = useMemo(() => {
    if (resourceInfoQuery.data) {
      return resourceInfoQuery.data.data;
    }
    return null;
  }, [resourceInfoQuery.data]);

  if (resourceInfoQuery.isLoading) {
    // 等待组件
    return (
      <div
        style={{
          margin: "0 auto",
          maxWidth: "800px",
        }}
      >
        <NormalSkeleton paddingTop="240px" />
      </div>
    );
  } else if (resourceInfoQuery.isError) {
    // 返回错误组件
    return (
      <div
        style={{
          margin: "0 auto",
          maxWidth: "800px",
        }}
      >
        <ErrorComponent
          message="获取资源详细信息失败"
          reason={handleAxiosError(resourceInfoQuery.error).content}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          margin: "0 auto",
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              default: "1.3rem",
              large: "1.5rem",
            },
            lineHeight: "2",
            color: (t) => t.palette.primary.light,
          }}
        >
          资源下载：
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <Chip
            icon={
              resourceInfo!.normal_download_cost === 0 ? undefined : (
                <MonetizationOn />
              )
            }
            size="small"
            label={
              resourceInfo!.normal_download_cost === 0
                ? "免费"
                : resourceInfo!.normal_download_cost
            }
            sx={{
              marginRight: "8px",
              backgroundColor: (t) =>
                resourceInfo!.normal_download_cost === 0
                  ? t.palette.success.main
                  : t.palette.secondary.main,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontSize: {
                default: "1.1rem",
                large: "1.2rem",
              },
              lineHeight: "1.5",
            }}
          >
            普通线路：
          </Typography>
          <Button
            variant="contained"
            disabled={!resourceInfo!.can_normal_download}
            sx={{
              padding: {
                default: "7px 16px",
                large: "8px 22px",
              },
              fontSize: {
                default: "0.875rem",
                large: "0.9375rem",
              },
            }}
            onClick={() => setDownloadDialogOpen(true)}
          >
            点此下载
          </Button>
          <ResourceDownloadDialog
            resourceId={resourceId}
            resourceName={resourceInfo!.name}
            cost={resourceInfo!.normal_download_cost}
            providerGroup="normal"
            open={DownloadDialogOpen}
            closeFn={() => setDownloadDialogOpen(false)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Chip
            icon={
              resourceInfo!.fast_download_cost === 0 ? undefined : (
                <MonetizationOn />
              )
            }
            size="small"
            label={
              resourceInfo!.fast_download_cost === 0
                ? "免费"
                : resourceInfo!.fast_download_cost
            }
            sx={{
              marginRight: "8px",
              backgroundColor: (t) =>
                resourceInfo!.fast_download_cost === 0
                  ? t.palette.success.main
                  : t.palette.secondary.main,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontSize: {
                default: "1.1rem",
                large: "1.2rem",
              },
              lineHeight: "1.5",
            }}
          >
            高速线路：
          </Typography>
          <Button
            variant="contained"
            disabled={!resourceInfo!.can_fast_download}
            sx={{
              padding: {
                default: "7px 16px",
                large: "8px 22px",
              },
              fontSize: {
                default: "0.875rem",
                large: "0.9375rem",
              },
            }}
            onClick={() => setDownloadDialogOpen(true)}
          >
            点此下载
          </Button>
          <ResourceDownloadDialog
            resourceId={resourceId}
            resourceName={resourceInfo!.name}
            cost={resourceInfo!.fast_download_cost}
            providerGroup="fast"
            open={DownloadDialogOpen}
            closeFn={() => setDownloadDialogOpen(false)}
          />
        </div>
        <Divider sx={{ margin: "16px 0" }} />
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              default: "1.3rem",
              large: "1.5rem",
            },
            lineHeight: "2",
            color: (t) => t.palette.primary.light,
          }}
        >
          描述：
        </Typography>
        <MarkdownParser>{resourceInfo!.description}</MarkdownParser>
      </div>
    );
  }
}

export default ResourceDetail;
