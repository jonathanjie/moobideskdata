// channel-type.name = Voice?
// TODO: Check SQL type then fix CTE 

module.exports.getForecastQuery = () => `WITH chatConversations AS (
        SELECT chat.conversation AS conversation_id,
        year(chat.createdAt) AS year, 
        month(chat.createdAt) AS month,
        day(chat.createdAt) AS day,
        hour(chat.createdAt) AS hour,
        COUNT(chat.conversation) AS numChats
      
        FROM (chat INNER JOIN conversation ON chat.conversation = conversation.uuid)
        
        GROUP BY year(conversation.createdAt) AS year, 
        month(conversation.createdAt) AS month,
        day(conversation.createdAt) AS day,
        hour(conversation.createdAt) AS hour,
        conversation.uuid
      )
      
      SELECT 
      year(CONVO.createdAt) AS year, month(CONVO.createdAt) AS month,
      day(CONVO.createdAt) AS day,
      hour(CONVO.createdAt) AS hour,
      COUNT(DISTINCT CONVO.uuid) AS "numConvo",
      
      -- numConvo
      COUNT (IF(channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook', 1, NULL)) AS chatNumConvos,
      COUNT (IF(channelType.name = 'Email', 1, NULL)) AS emailNumConvos,
      COUNT (IF(channelType.name = 'Voice', 1, NULL)) AS voiceNumConvos,
      
      -- avrConvoDuration
      AVG(IF(channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS textAvgMins,
      AVG(IF(channelType.name = 'Email', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS emailAvgMins,
      AVG(IF(channelType.name = 'Voice', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS voiceAvgMins,
      
      -- avrNumChatsPerConvo
      AVG(IF(channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook', CHATSCONVERSATION.numChats, NULL)) AS textAvgChatsPerConvo,
      AVG(IF(channelType.name = 'Email', CHATSCONVERSATION.numChats, NULL)) AS emailAvgChatsPerConvo,
      
      -- numDispositions
      -- disposition types: dispo1, dispo2, dispo3
      -- chats
      COUNT(IF((channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook') AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF((channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook') AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF((channelType.name = 'Telegram' OR channelType.name = 'SMS' OR channelType.name = 'Facebook') AND DISPOSITION.name = 'dispo3', 1, NULL)),
      -- email
      COUNT(IF(channelType.name = 'Email' AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF(channelType.name = 'Email' AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF(channelType.name = 'Email' AND DISPOSITION.name = 'dispo3', 1, NULL)),
      -- voice 
      COUNT(IF(channelType.name = 'Voice' AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF(channelType.name = 'Voice' AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF(channelType.name = 'Voice' AND DISPOSITION.name = 'dispo3', 1, NULL))
      
      
      FROM (conversation AS CONVO 
        INNER JOIN channelType ON CONVO.lastMessageChannelType = channelType.uuid 
        INNER JOIN CHATSCONVERSATION AS CHATSCONVERSATION ON CONVO.uuid = CHATSCONVERSATION.conversation_id
        INNER JOIN disposition AS DISPOSITION ON CONVO.disposition = DISPOSITION.key) 
      
      GROUP BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt)
      ORDER BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt);`


module.exports.getRecommendationQuery = () => `WITH channelAgnostic AS (
  SELECT CHAT.conversation,
  year(CHAT.createdAt) AS year, 
  month(CHAT.createdAt) AS month,
  day(CHAT.createdAt) AS day,
  hour(CHAT.createdAt) AS hour,
  COUNT(DISTINCT CHAT.agents) AS numAgents,
  COUNT(IF(CONVERSATION.abandoned = false, 1, NULL)) AS numConvosHandled,
  CHAT.channel AS channel,
  CHAT.createdAt AS createdAt
  FROM (
    chat AS CHAT
    INNER JOIN conversation AS CONVERSATION ON CONVERSATION.uuid = CHAT.conversation
  )
  GROUP BY year(CHAT.createdAt), month(CHAT.createdAt), day(CHAT.createdAt), hour(CHAT.createdAt), channel
)

SELECT channelAgnostic.year AS year,
channelAgnostic.month AS month,
channelAgnostic.day AS day,
channelAgnostic.hour AS hour,
channelAgnostic.channel AS channel,

-- numAgents
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook', channelAgnostic.numAgents, NULL)) AS numAgentsText,
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Email', channelAgnostic.numAgents, NULL)) AS numAgentsTextEmail, 
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Email' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsTextEmailVoice,  
COUNT(IF(channel = 'Email', channelAgnostic.numAgents, NULL)) AS numAgentsEmail,
COUNT(IF(channel = 'Email' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsEmailVoice,
COUNT(IF(channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numVoice,  
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Voice', channelAgnostic.numAgents, NULL)) AS numAgentsTextVoice,

-- numConvoHandled
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledText,
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Email', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextEmail, 
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Email' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextEmailVoice,  
COUNT(IF(channel = 'Email', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledEmail,
COUNT(IF(channel = 'Email' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledEmailVoice,
COUNT(IF(channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numVoice,  
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' OR channel = 'Voice', channelAgnostic.numConvosHandled, NULL)) AS numConvosHandledTextVoice,

-- percentageMetSLA
COUNT(IF(channel = 'Email' AND conversationSlaLog.isSlaSuccess = true, 1, NULL))/COUNT(IF(channel = 'Email', 1, NULL)) AS emailPercentageSLA,
COUNT(IF(channel = 'Voice' AND conversationSlaLog.isSlaSuccess = true, 1, NULL))/COUNT(IF(channel = 'Voice', 1, NULL)) AS voicePercentageSLA,
COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook' AND conversationSlaLog.isSlaSuccess = true, 1, NULL))/COUNT(IF(channel = 'Telegram' OR channel = 'SMS' OR channel = 'Facebook', 1, NULL)) AS textPercentageSLA

FROM (
  channelAgnostic 
  INNER JOIN conversation-sla-log AS conversationSlaLog ON channelAgnostic.conversation = conversationSlaLog.conversation
)
ORDER BY year(CHAT.createdAt), month(CHAT.createdAt), day(CHAT.createdAt), hour(CHAT.createdAt);`
