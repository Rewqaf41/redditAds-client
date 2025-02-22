// Get A Report
// POST https //ads-api.reddit.com/api/v3/ad_accounts/{ad_account_id}/reports

interface IGetReportRequest {
	data: IDataReportRequest
}

interface IDataReportRequest {
	breakdowns: Breakdowns[]
	custom_column_ids?: Array<string>
	fields: Fields[]
	filter?: string
	starts_at: string
	ends_at: string
	time_zone_id?: string
}

type Breakdowns = "AD_ACCOUNT_ID" | "AD_GROUP_ID" | "AD_ID" | "COUNTRY" | "DATE" | "HOUR" | "DMA" | "METRO" | "CAROUSEL_CARD" | "GALLERY_ITEM_ID" | "GENDER" | "INTEREST" | "KEYWORD" | "PLACEMENT" | "OS_TYPE" | "REGION" | "COMMUNITY" | "ACCOUNT_ID" | "SUBREDDIT" | "ADGROUP_ID"

type Fields = "ACCOUNT_ID" | "AD_CREATE_TIME" | "AD_EFFECTIVE_STATUS" | "AD_GROUP_ID" | "AD_ID" | "AD_UPDATE_TIME" | "ADGROUP_CREATE_TIME" | "ADGROUP_UPDATE_TIME" | "BID_STRATEGY" | "CAMPAIGN_CREATE_TIME" | "CAMPAIGN_ID" | "CAMPAIGN_UPDATE_TIME" | "CLICKS" | "COMMUNITY" | "COUNTRY" | "CPC" | "CPV" | "CTR" | "CURRENCY" | "DATE" | "DATETIME" | "DMA" | "ECPM" | "FREQUENCY" | "GALLERY_ITEM_CAPTION" | "GALLERY_ITEM_ID" | "GENDER" | "HOUR" | "IMPRESSIONS" | "INTEREST" | "KEY_CONVERSION_CLICKS" | "KEY_CONVERSION_ECPA" | "KEY_CONVERSION_RATE" | "KEY_CONVERSION_TOTAL_COUNT" | "KEY_CONVERSION_VIEWS" | "KEYWORD" | "PLACEMENT" | "POST_ID" | "PRIORITY" | "REACH" | "REDDIT_LEADS" | "REGION" | "SPEND" | "ENGAGED_CLICK" | "CLICK_ATTRIBUTION_WINDOW" | "VIEW_ATTRIBUTION_WINDOW"

interface IGetReportResponse {
	data: IGetReportDataResponse
}

interface IGetReportDataResponse {
	metrics: Array<Object<string>>
	metrics_updated_at?: string
}
