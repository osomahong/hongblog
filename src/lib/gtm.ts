/**
 * Google Tag Manager dataLayer 이벤트 헬퍼 함수
 */

// dataLayer 타입 확장
declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

/**
 * dataLayer에 이벤트를 전송하는 기본 함수
 */
function pushDataLayerEvent(eventName: string, eventData: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...eventData,
    });

    // 개발 환경에서는 콘솔에도 로그 출력
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 GTM dataLayer event:', eventName, eventData);
    }
}

/**
 * 1. 콘텐츠 조회 이벤트
 */
export function trackViewContent(params: {
    contentType: 'post' | 'faq' | 'class' | 'series';
    contentId: number;
    contentTitle: string;
    contentSlug: string;
    category?: string;
    tags?: string[];
}) {
    pushDataLayerEvent('view_content', {
        content_type: params.contentType,
        content_id: params.contentId,
        content_title: params.contentTitle,
        content_slug: params.contentSlug,
        category: params.category,
        tags: params.tags,
    });
}

/**
 * 2. 메인페이지 섹션 클릭 이벤트
 */
export function trackMainSectionClick(params: {
    section: 'trending' | 'category' | 'latest_insights' | 'popular_faqs' | 'tags' | 'about_author';
    contentType: 'post' | 'faq' | 'category' | 'tag' | 'about';
    contentTitle: string;
    contentSlug?: string;
    position?: number;
}) {
    pushDataLayerEvent('main_section_click', {
        section: params.section,
        content_type: params.contentType,
        content_title: params.contentTitle,
        content_slug: params.contentSlug,
        position: params.position,
    });
}

/**
 * 3. 연관 콘텐츠 클릭 이벤트
 */
export function trackRelatedContentClick(params: {
    sourceType: 'post' | 'faq' | 'class';
    sourceId: number;
    sourceTitle: string;
    relatedType: 'post' | 'faq' | 'class';
    relatedSection: 'related_faqs' | 'related_classes' | 'related_posts' | 'prev_next_class';
    relatedTitle: string;
    relatedSlug: string;
    position?: number;
}) {
    pushDataLayerEvent('related_content_click', {
        source_type: params.sourceType,
        source_id: params.sourceId,
        source_title: params.sourceTitle,
        related_type: params.relatedType,
        related_section: params.relatedSection,
        related_title: params.relatedTitle,
        related_slug: params.relatedSlug,
        position: params.position,
    });
}

/**
 * 4. 태그 클릭 이벤트
 */
export function trackTagClick(params: {
    tagName: string;
    sourcePage: 'home' | 'post' | 'faq' | 'class' | 'series';
    sourceLocation: 'explore_tags' | 'content_header' | 'content_footer';
    sourceContentId?: number;
    sourceContentTitle?: string;
}) {
    pushDataLayerEvent('tag_click', {
        tag_name: params.tagName,
        source_page: params.sourcePage,
        source_location: params.sourceLocation,
        source_content_id: params.sourceContentId,
        source_content_title: params.sourceContentTitle,
    });
}

/**
 * 5. 시리즈 네비게이션 클릭 이벤트
 */
export function trackSeriesNavigationClick(params: {
    seriesId: number;
    seriesTitle: string;
    currentPostId: number;
    currentPostTitle: string;
    navigationAction: 'prev' | 'next' | 'list';
    targetPostTitle?: string;
}) {
    pushDataLayerEvent('series_navigation_click', {
        series_id: params.seriesId,
        series_title: params.seriesTitle,
        current_post_id: params.currentPostId,
        current_post_title: params.currentPostTitle,
        navigation_action: params.navigationAction,
        target_post_title: params.targetPostTitle,
    });
}

/**
 * 6. 카테고리 클릭 이벤트
 */
export function trackCategoryClick(params: {
    categoryName: 'AI_TECH' | 'DATA' | 'MARKETING';
    sourcePage: 'home' | 'post' | 'faq' | 'class';
    sourceLocation: 'category_card' | 'content_badge';
}) {
    pushDataLayerEvent('category_click', {
        category_name: params.categoryName,
        source_page: params.sourcePage,
        source_location: params.sourceLocation,
    });
}

/**
 * 7. 외부 링크 클릭 이벤트
 */
export function trackExternalLinkClick(params: {
    linkUrl: string;
    linkText: string;
    sourcePage: string;
    sourceContentId?: number;
}) {
    pushDataLayerEvent('external_link_click', {
        link_url: params.linkUrl,
        link_text: params.linkText,
        source_page: params.sourcePage,
        source_content_id: params.sourceContentId,
    });
}

/**
 * 8. Back 버튼 클릭 이벤트
 */
export function trackBackButtonClick(params: {
    sourcePage: 'post' | 'faq' | 'class';
    sourceContentId: number;
    destination: string;
}) {
    pushDataLayerEvent('back_button_click', {
        source_page: params.sourcePage,
        source_content_id: params.sourceContentId,
        destination: params.destination,
    });
}
