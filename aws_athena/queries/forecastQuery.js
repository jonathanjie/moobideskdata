// channel-type.name = Voice?

module.exports.getQuery = () => `WITH chatConversations AS (
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
      COUNT (IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', 1, NULL)) AS chatNumConvos,
      COUNT (IF(channel-type.name = 'Email', 1, NULL)) AS emailNumConvos,
      COUNT (IF(channel-type.name = 'Voice', 1, NULL)) AS voiceNumConvos,
      
      -- avrConvoDuration
      AVG(IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS textAvgMins
      AVG(IF(channel-type.name = 'Email', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS emailAvgMins,
      AVG(IF(channel-type.name = 'Voice', date_diff('minute', CONVO.createdAt, CONVO.closedTime), NULL)) AS voiceAvgMins,
      
      -- avrNumChatsPerConvo
      AVG(IF(channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook', CHATSCONVERSATION.numChats, NULL)) AS textAvgChatsPerConvo
      AVG(IF(channel-type.name = 'Email', CHATSCONVERSATION.numChats, NULL)) AS emailAvgChatsPerConvo,
      
      -- numDispositions
      -- disposition types: dispo1, dispo2, dispo3
      -- chats
      COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF((channel-type.name = 'Telegram' OR channel-type.name = 'SMS' OR channel-type.name = 'Facebook') AND DISPOSITION.name = 'dispo3', 1, NULL)),
      -- email
      COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF(channel-type.name = 'Email' AND DISPOSITION.name = 'dispo3', 1, NULL)),
      -- voice 
      COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo1', 1, NULL)),
      COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo2', 1, NULL)),
      COUNT(IF(channel-type.name = 'Voice' AND DISPOSITION.name = 'dispo3', 1, NULL))
      
      
      FROM (conversation AS CONVO 
        INNER JOIN channel-type ON CONVO.lastMessageChannelType = channel-type.uuid 
        INNER JOIN CHATSCONVERSATION AS CHATSCONVERSATION ON CONVO.uuid = CHATSCONVERSATION.conversation_id
        INNER JOIN disposition AS DISPOSITION ON CONVO.disposition = DISPOSITION.key) 
      
      GROUP BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt)
      ORDER BY year(CONVO.conversationcreatedAt), month(CONVO.conversationcreatedAt), day(CONVO.conversationcreatedAt), hour(CONVO.conversationcreatedAt);`


