import React from "react";
import { Composition } from "remotion";
import { PostThumbnail } from "./thumbnails/PostThumbnail";
import { FaqThumbnail } from "./thumbnails/FaqThumbnail";
import { ClassThumbnail } from "./thumbnails/ClassThumbnail";
import { THUMBNAIL } from "./thumbnails/shared/tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PostThumbnail"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={PostThumbnail as any}
        durationInFrames={1}
        fps={1}
        width={THUMBNAIL.WIDTH}
        height={THUMBNAIL.HEIGHT}
        defaultProps={{
          title: "프롬프트 엔지니어링의 시대는 끝나가고 있습니다",
          category: "AI_TECH",
        }}
      />
      <Composition
        id="FaqThumbnail"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={FaqThumbnail as any}
        durationInFrames={1}
        fps={1}
        width={THUMBNAIL.WIDTH}
        height={THUMBNAIL.HEIGHT}
        defaultProps={{
          title: "AI로 블로그 글을 쓰면 SEO에 불이익이 있나요?",
          category: "AI_TECH",
        }}
      />
      <Composition
        id="ClassThumbnail"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ClassThumbnail as any}
        durationInFrames={1}
        fps={1}
        width={THUMBNAIL.WIDTH}
        height={THUMBNAIL.HEIGHT}
        defaultProps={{
          title: "어트리뷰션(Attribution)",
          courseName: "디지털 마케팅 기초",
        }}
      />
    </>
  );
};
