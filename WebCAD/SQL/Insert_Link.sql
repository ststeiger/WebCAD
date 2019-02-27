
/*

SELECT 
	 T_FMS_Translation.FT_DE
	,T_FMS_Navigation.* 
FROM T_FMS_Navigation 
LEFT JOIN T_FMS_Translation ON T_FMS_Translation.FT_UID = T_FMS_Navigation.NA_FT_UID 
WHERE FT_De LIKE '%reinig%'



SELECT 
	 T_FMS_Translation.FT_DE
	,T_FMS_Navigation.* 
FROM T_FMS_Navigation 
LEFT JOIN T_FMS_Translation ON T_FMS_Translation.FT_UID = T_FMS_Navigation.NA_FT_UID 
WHERE NA_NA_UID = 'F0000000-E000-0000-0000-000000000002' 
*/






INSERT INTO T_FMS_Translation
(
	 FT_UID
	,FT_Ch
	,FT_De
	,FT_En
	,FT_Fr
	,FT_It
	,FT_Ru
	,FT_Parameter
	,FT_Status
)
SELECT 
	 'D32E3A3D-32C5-4716-A368-65FA67A79E06' AS FT_UID
	,N'Rainigung' AS FT_Ch
	,N'Reinigung' AS FT_De
	,N'Cleaning' AS FT_En
	,N'Nettoyage' AS FT_Fr
	,N'Pulizie' AS FT_It
	,N'Уборка' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = 'D32E3A3D-32C5-4716-A368-65FA67A79E06') 

UNION 

SELECT 
	 'CE1C951C-56E8-4F29-A5B1-84324B018D6B' AS FT_UID
	,N'Rainigungsgruppä pro Gschoss' AS FT_Ch
	,N'Reinigungsgruppen pro Geschoss' AS FT_De
	,N'Cleaning groups per floor' AS FT_En
	,N'Groupes de nettoyage par étage' AS FT_Fr
	,N'Gruppi di pulizia per piano' AS FT_It
	,N'Уборка групп на этаже' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = 'CE1C951C-56E8-4F29-A5B1-84324B018D6B') 
-- CM_Reinigungsgruppen

UNION 

SELECT 
	 'DC8114D2-6032-4069-9FB2-34C56830CEE9' AS FT_UID
	,N'Nöd gnutzti Rainigungsgruppä' AS FT_Ch
	,N'Nicht genutzte Reinigungsgruppen' AS FT_De
	,N'Unused cleaning groups' AS FT_En
	,N'Groupes de nettoyage non utilisés' AS FT_Fr
	,N'Gruppi di pulizia non utilizzati' AS FT_It
	,N'Неиспользованные группы очистки' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = 'DC8114D2-6032-4069-9FB2-34C56830CEE9') 
-- CM_Ungenutzte_Reinigungsgruppen


UNION 

SELECT 
	 'A8CEEFC7-436F-4A9B-A556-6AB6005F68E3' AS FT_UID
	,N'Nöd vorhandäni Rainigungsgruppä' AS FT_Ch
	,N'Nicht vorhandene Reinigungsgruppen' AS FT_De
	,N'Non-existent cleaning groups' AS FT_En
	,N'Groupes de nettoyage inexistants' AS FT_Fr
	,N'Gruppi di pulizia inesistenti' AS FT_It
	,N'Несуществующие группы очистки' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = 'A8CEEFC7-436F-4A9B-A556-6AB6005F68E3') 
-- CM_Nicht_vorhandene_Reinigungsgruppen
;



INSERT INTO T_FMS_Navigation
(
	 NA_UID
	,NA_NA_UID
	,NA_FT_UID
	,NA_Color
	,NA_Frame
	,NA_Image
	,NA_Link
	,NA_NodeID
	,NA_ParentNodeID
	,NA_Sort
	,NA_Status
	,NA_useLoading
	,NA_MOD_UID
	,NA_Guidename
	,NA_useList
	,NA_Guide_UID
	,NA_isDefault
	,NA_menuLink
)
-- Hauptgruppe
SELECT 
	 '01400E87-B5A4-4DF7-B601-CFDE1F7C3E7F' AS NA_UID 
	,'F0000000-E000-0000-0000-000000000002' AS NA_NA_UID 
	,'D32E3A3D-32C5-4716-A368-65FA67A79E06' AS NA_FT_UID 
	,'761092' AS NA_Color 
	,NULL AS NA_Frame 
	,NULL AS NA_Image 
	,'' AS NA_Link 
	,NULL AS NA_NodeID 
	,'coRight' AS NA_ParentNodeID 
	,0 AS NA_Sort 
	,1 AS NA_Status 
	,NULL AS NA_useLoading
	,NULL AS NA_MOD_UID
	,NULL AS NA_Guidename
	,NULL AS NA_useList
	,NULL AS NA_Guide_UID
	,NULL AS NA_isDefault
	,NULL AS NA_menuLink 
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = '01400E87-B5A4-4DF7-B601-CFDE1F7C3E7F' )




INSERT INTO T_FMS_Navigation
(
	 NA_UID
	,NA_NA_UID
	,NA_FT_UID
	,NA_Color
	,NA_Frame
	,NA_Image
	,NA_Link
	,NA_NodeID
	,NA_ParentNodeID
	,NA_Sort
	,NA_Status
	,NA_useLoading
	,NA_MOD_UID
	,NA_Guidename
	,NA_useList
	,NA_Guide_UID
	,NA_isDefault
	,NA_menuLink
)
SELECT 
	 'C75EBD86-CD27-4AFB-A27B-03B0207EA871' AS NA_UID -- uniqueidentifier 
	,'01400E87-B5A4-4DF7-B601-CFDE1F7C3E7F' AS NA_NA_UID -- uniqueidentifier 
	,'CE1C951C-56E8-4F29-A5B1-84324B018D6B' AS NA_FT_UID -- uniqueidentifier 
	,'761092' AS NA_Color -- nvarchar(6) 
	,NULL AS NA_Frame -- nvarchar(20) 
	,NULL AS NA_Image -- nvarchar(100) 
	,'{@report}CM_Reinigungsgruppen&proc={@proc}&in_sprache={@language}&rc:Stylesheet=COR_RS2012_v7' AS NA_Link -- nvarchar(400) 
	,NULL AS NA_NodeID -- nvarchar(25) 
	,'coRight' AS NA_ParentNodeID -- nvarchar(25) 
	,0 AS NA_Sort -- int 
	,1 AS NA_Status -- int 
	,0 AS NA_useLoading -- bit 
	,NULL AS NA_MOD_UID -- uniqueidentifier 
	,NULL AS NA_Guidename -- nvarchar(200) 
	,NULL AS NA_useList -- bit 
	,NULL AS NA_Guide_UID -- uniqueidentifier 
	,NULL AS NA_isDefault -- bit 
	,NULL AS NA_menuLink -- varchar(400) 
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = 'C75EBD86-CD27-4AFB-A27B-03B0207EA871' )

UNION ALL 

SELECT 
	 'E2E58D90-A9BC-4140-9F6C-5963CA9D3C6B' AS NA_UID -- uniqueidentifier 
	,'01400E87-B5A4-4DF7-B601-CFDE1F7C3E7F' AS NA_NA_UID -- uniqueidentifier 
	,'DC8114D2-6032-4069-9FB2-34C56830CEE9' AS NA_FT_UID -- uniqueidentifier 
	,'761092' AS NA_Color -- nvarchar(6) 
	,NULL AS NA_Frame -- nvarchar(20) 
	,NULL AS NA_Image -- nvarchar(100) 
	,'{@report}CM_Ungenutzte_Reinigungsgruppen&proc={@proc}&in_sprache={@language}&rc:Stylesheet=COR_RS2012_v7' AS NA_Link -- nvarchar(400) 
	,NULL AS NA_NodeID -- nvarchar(25) 
	,'coRight' AS NA_ParentNodeID -- nvarchar(25) 
	,0 AS NA_Sort -- int 
	,1 AS NA_Status -- int 
	,0 AS NA_useLoading -- bit 
	,NULL AS NA_MOD_UID -- uniqueidentifier 
	,NULL AS NA_Guidename -- nvarchar(200) 
	,NULL AS NA_useList -- bit 
	,NULL AS NA_Guide_UID -- uniqueidentifier 
	,NULL AS NA_isDefault -- bit 
	,NULL AS NA_menuLink -- varchar(400) 
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = 'E2E58D90-A9BC-4140-9F6C-5963CA9D3C6B' ) 

UNION ALL 


SELECT 
	 '1EC9E5D3-143F-4D64-BC46-24D2357AC13C' AS NA_UID -- uniqueidentifier 
	,'01400E87-B5A4-4DF7-B601-CFDE1F7C3E7F' AS NA_NA_UID -- uniqueidentifier 
	,'A8CEEFC7-436F-4A9B-A556-6AB6005F68E3' AS NA_FT_UID -- uniqueidentifier 
	,'761092' AS NA_Color -- nvarchar(6) 
	,NULL AS NA_Frame -- nvarchar(20) 
	,NULL AS NA_Image -- nvarchar(100) 
	,'{@report}CM_Nicht_vorhandene_Reinigungsgruppen&proc={@proc}&in_sprache={@language}&rc:Stylesheet=COR_RS2012_v7' AS NA_Link -- nvarchar(400) 
	,NULL AS NA_NodeID -- nvarchar(25) 
	,'coRight' AS NA_ParentNodeID -- nvarchar(25) 
	,0 AS NA_Sort -- int 
	,1 AS NA_Status -- int 
	,0 AS NA_useLoading -- bit 
	,NULL AS NA_MOD_UID -- uniqueidentifier 
	,NULL AS NA_Guidename -- nvarchar(200) 
	,NULL AS NA_useList -- bit 
	,NULL AS NA_Guide_UID -- uniqueidentifier 
	,NULL AS NA_isDefault -- bit 
	,NULL AS NA_menuLink -- varchar(400) 
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = '1EC9E5D3-143F-4D64-BC46-24D2357AC13C' ) 
;
