WITH dataset AS (
    SELECT CHAT.conversation AS conversation_key,
        year(CHAT.createdAt) AS year, 
        month(CHAT.createdAt) AS month,
        day(CHAT.createdAt) AS day,
        hour(CHAT.createdAt) AS hour,
        CHAT.agent AS agent,
        CHAT.channel AS channel,
        CONVERSATION.abandoned AS abandoned,
        SLA.isslasuccess AS sla
    FROM (
        moobi_chats AS CHAT
        INNER JOIN moobi_conversations AS CONVERSATION ON CONVERSATION._id = CHAT.conversation
        INNER JOIN moobi_conversationslalogs AS SLA ON CONVERSATION._id = SLA.conversation
    )
    WHERE CHAT.direction = 'out'
    GROUP BY year(CHAT.createdAt),
        month(CHAT.createdAt),
        day(CHAT.createdAt),
        hour(CHAT.createdAt),
        CHAT.agent,
        CHAT.channel,
        CHAT.conversation,
        CHAT.direction,
        CONVERSATION.abandoned,
        SLA.isslasuccess
    ORDER BY year(CHAT.createdAt),
        month(CHAT.createdAt),
        day(CHAT.createdAt),
        hour(CHAT.createdAt),
        CHAT.conversation
)

SELECT
    -- DATE
    dataset.year AS year,
    dataset.month AS month,
    dataset.day AS day,
    dataset.hour AS hour,
    
    -- NUMBER OF AGENTS
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line') THEN dataset.agent END)) AS numAgentsText,
    COUNT(DISTINCT(CASE WHEN dataset.channel = 'Voice' THEN dataset.agent END)) AS numAgentsVoice,
    COUNT(DISTINCT(CASE WHEN dataset.channel = 'Email' THEN dataset.agent END)) AS numAgentsEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Email') THEN dataset.agent END)) AS numAgentsTextEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Voice') THEN dataset.agent END)) AS numAgentsTextVoice,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Voice', 'Email') THEN dataset.agent END)) AS numAgentsVoiceEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Voice', 'Email') THEN dataset.agent END)) AS numAgentsTextVoiceEmail,
    
    -- NUMBER OF CONVERSATIONS HANDLED
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosText,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Voice') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosVoice,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Email') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Email') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosTextEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Voice') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosTextVoice,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Voice', 'Email') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosVoiceEmail,
    COUNT(DISTINCT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line', 'Voice', 'Email') AND (dataset.abandoned = false OR dataset.abandoned IS NULL) THEN dataset.conversation_key END)) AS numConvosTextVoiceEmail,
    
    -- SLA PERCENTAGES
    ROUND((COUNT(CASE WHEN dataset.sla = true AND dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line') THEN dataset.sla END) + 0.0) / (COUNT(CASE WHEN dataset.channel IN ('Telegram', 'Facebook', 'SMS', 'Web Chat', 'Twitter', 'Instagram', 'WhatsApp', 'Line') THEN dataset.conversation_key END) + 0.0), 2) AS textSla,
    ROUND((COUNT(CASE WHEN dataset.sla = true AND dataset.channel = 'Voice' THEN dataset.sla END) + 0.0) / (COUNT(CASE WHEN dataset.channel = 'Voice' THEN dataset.conversation_key END) + 0.0), 2) AS voiceSla,
    ROUND((COUNT(CASE WHEN dataset.sla = true AND dataset.channel = 'Email' THEN dataset.sla END) + 0.0) / (COUNT(CASE WHEN dataset.channel = 'Email' THEN dataset.conversation_key END) + 0.0), 2) AS emailSla

FROM dataset
GROUP BY
    dataset.year,
    dataset.month,
    dataset.day,
    dataset.hour
ORDER BY
    dataset.year,
    dataset.month,
    dataset.day,
    dataset.hour