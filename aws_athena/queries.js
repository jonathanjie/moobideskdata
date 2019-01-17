// channel-type.name = Voice?
// TODO: Check SQL type then fix CTE 

module.exports.getForecastQuery = () => `WITH chatConversations AS (
  SELECT year(moobi_chats.createdAt) AS year, 
  month(moobi_chats.createdAt) AS month,
  day(moobi_chats.createdAt) AS day,
  hour(moobi_chats.createdAt) AS hour,
  COUNT(moobi_chats.conversation) AS numChats,
  moobi_chats.conversation AS conversation_id

  FROM (moobi_chats INNER JOIN moobi_conversations ON moobi_chats.conversation = moobi_conversations._id)
  
  GROUP BY
  year(moobi_chats.createdAt), 
  month(moobi_chats.createdAt),
  day(moobi_chats.createdAt),
  hour(moobi_chats.createdAt),
  moobi_chats.conversation
)

SELECT 
  year(CONVO.createdAt) AS year, month(CONVO.createdAt) AS month,
  day(CONVO.createdAt) AS day,
  hour(CONVO.createdAt) AS hour,
  COUNT(DISTINCT CONVO._id) AS "numConvo",
  
  -- numConvo
  COUNT (IF(moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram', 1, NULL)) AS chatNumConvos,
  COUNT (IF(moobi_channelTypes.name = 'Email', 1, NULL)) AS emailNumConvos,
  COUNT (IF(moobi_channelTypes.name = 'Voice', 1, NULL)) AS voiceNumConvos,
  
  -- avrConvoDuration
  AVG(IF(moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS textAvgMins,
  AVG(IF(moobi_channelTypes.name = 'Email', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS emailAvgMins,
  AVG(IF(moobi_channelTypes.name = 'Voice', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS voiceAvgMins,
  
  -- avrNumChatsPerConvo
  AVG(IF(moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram', CHATSCONVERSATION.numChats, NULL)) AS textAvgChatsPerConvo,
  AVG(IF(moobi_channelTypes.name = 'Email', CHATSCONVERSATION.numChats, NULL)) AS emailAvgChatsPerConvo,
  
  -- numDispositions
  -- chats
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'Plan Enquiry', 1, NULL)) AS dispositionChatPlanEnquiry,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'New Sign Up', 1, NULL)) AS dispositionChatNewSignUp,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'General Sales', 1, NULL)) AS dispositionChatGeneralSales,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'Sample Disposition', 1, NULL)) AS dispositionChatSampleDisposition,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'Product Enquiry', 1, NULL)) AS dispositionChatProductEnquiry,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'General Enquiry', 1, NULL)) AS dispositionChatGeneralEnquiry,
  COUNT(IF((moobi_channelTypes.name = 'Telegram' OR moobi_channelTypes.name = 'SMS' OR moobi_channelTypes.name = 'Facebook' OR moobi_channelTypes.name = 'WhatsApp' OR moobi_channelTypes.name = 'Line' OR moobi_channelTypes.name = 'Web Chat' OR moobi_channelTypes.name = 'WeChat' OR moobi_channelTypes.name = 'Twitter' OR moobi_channelTypes.name = 'Instagram') AND DISPOSITION.name = 'Feedback', 1, NULL)) AS dispositionChatFeedback,
  -- email
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'Plan Enquiry', 1, NULL)) AS dispositionEmailPlanEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'New Sign Up', 1, NULL)) AS dispositionEmailNewSignUp,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'General Sales', 1, NULL)) AS dispositionEmailGeneralSales,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'Sample Disposition', 1, NULL)) AS dispositionEmailSampleDisposition,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'Product Enquiry', 1, NULL)) AS dispositionEmailProductEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'General Enquiry', 1, NULL)) AS dispositionEmailGeneralEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Email' AND DISPOSITION.name = 'Feedback', 1, NULL)) AS dispositionEmailFeedback,
  -- voice 
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'Plan Enquiry', 1, NULL)) AS dispositionVoicePlanEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'New Sign Up', 1, NULL)) AS dispositionVoiceNewSignUp,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'General Sales', 1, NULL)) AS dispositionVoiceGeneralSales,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'Sample Disposition', 1, NULL)) AS dispositionVoiceSampleDisposition,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'Product Enquiry', 1, NULL)) AS dispositionVoiceProductEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'General Enquiry', 1, NULL)) AS dispositionVoiceGeneralEnquiry,
  COUNT(IF(moobi_channelTypes.name = 'Voice' AND DISPOSITION.name = 'Feedback', 1, NULL)) AS dispositionVoiceFeedback
  

FROM (moobi_conversations AS CONVO 
  INNER JOIN moobi_channelTypes ON CONVO.lastMessageChannelType = moobi_channelTypes._id 
  INNER JOIN chatConversations AS CHATSCONVERSATION ON CONVO._id = CHATSCONVERSATION.conversation_id
  INNER JOIN moobi_dispositions AS DISPOSITION ON CONVO.disposition = DISPOSITION._id
) 
  
GROUP BY year(CONVO.createdAt), month(CONVO.createdAt), day(CONVO.createdAt), hour(CONVO.createdAt)
ORDER BY year(CONVO.createdAt), month(CONVO.createdAt), day(CONVO.createdAt), hour(CONVO.createdAt);`


module.exports.getRecommendationQuery = () => `WITH channelAgnostic AS (
  SELECT CHAT.conversation AS conversation_key,
  year(CHAT.createdAt) AS year, 
  month(CHAT.createdAt) AS month,
  day(CHAT.createdAt) AS day,
  hour(CHAT.createdAt) AS hour,
  COUNT(DISTINCT CHAT.agent) AS numAgents,
  COUNT(IF(CONVERSATION.abandoned IS NOT NULL AND CONVERSATION.abandoned = false, 1, NULL)) AS numConvosHandled,
  CHAT.channel AS channel
  FROM (
    moobi_chats AS CHAT
    INNER JOIN moobi_conversations AS CONVERSATION ON CONVERSATION._id = CHAT.conversation
  )
  GROUP BY year(CHAT.createdAt), month(CHAT.createdAt), day(CHAT.createdAt), hour(CHAT.createdAt), channel, CHAT.conversation
)

SELECT channelAgnostic.year AS year,
channelAgnostic.month AS month,
channelAgnostic.day AS day,
channelAgnostic.hour AS hour

-- numAgents
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line', channelAgnostic.numAgents, NULL)) AS numAgentsText,
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Email', channelAgnostic.numAgents, NULL)) AS numAgentsTextEmail, 
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Email' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsTextEmailVoice,  
SUM(IF(channel = 'Email', channelAgnostic.numAgents, NULL)) AS numAgentsEmail,
SUM(IF(channel = 'Email' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsEmailVoice,
SUM(IF(channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsVoice,  
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsTextVoice,

-- numConvoHandled
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledText,
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Email', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextEmail,
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Email' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextEmailVoice,
SUM(IF(channel = 'Email', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledEmail,
SUM(IF(channel = 'Email' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledEmailVoice,
SUM(IF(channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledVoice,
SUM(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextVoice,

-- percentageMetSLA
CAST(COUNT(IF(channel = 'Email' AND conversationSlaLog.isSlaSuccess = true, 1, NULL)) AS decimal(10,4))/CAST(NULLIF(COUNT(IF(channel = 'Email', 1, NULL)), 0) AS decimal(10,4)) AS emailPercentageSLA,
CAST(COUNT(IF(channel = 'Voice' AND conversationSlaLog.isSlaSuccess = true, 1, NULL)) AS decimal(10,4))/CAST(NULLIF(COUNT(IF(channel = 'Voice', 1, NULL)), 0) AS decimal(10,4)) AS voicePercentageSLA,
CAST(COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line' AND conversationSlaLog.isSlaSuccess = true, 1, NULL)) AS decimal(10,4))/CAST(NULLIF(COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Web Chat' OR channel = 'Twitter' OR channel = 'Instagram' OR channel = 'WhatsApp' OR channel = 'Line', 1, NULL)), 0) AS decimal(10,4)) AS textPercentageSLA

FROM (
  channelAgnostic 
  INNER JOIN moobi_conversationslalogs AS conversationSlaLog ON channelAgnostic.conversation_key = conversationSlaLog.conversation
)

GROUP BY channelAgnostic.year,
channelAgnostic.month,
channelAgnostic.day,
channelAgnostic.hour
ORDER BY channelAgnostic.year,
channelAgnostic.month,
channelAgnostic.day,
channelAgnostic.hour;`
