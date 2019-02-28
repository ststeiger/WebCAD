
/*
SELECT * FROM T_FMS_translation 
WHERE FT_UID = 'e5e34680-b2b1-4a11-90b3-491ea2d09724' 
OR FT_UID = '37812603-539b-407f-9f6c-2a8f514b3fde' 



SELECT FT_DE, T_FMS_Navigation.* FROM T_FMS_Navigation 
LEFT JOIN T_FMS_Translation ON FT_UID = NA_FT_UID 
WHERE NA_NA_UID = 'f0000000-e000-0000-0000-000000000002'



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
/*
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
*/

SELECT 
	 '37812603-539b-407f-9f6c-2a8f514b3fde' AS FT_UID
	,N'Rüm noch Miätobijekt' AS FT_Ch
	,N'Räume nach Mietobjekt' AS FT_De
	,N'Rooms by rental object' AS FT_En
	,N'Locaux par objet de location' AS FT_Fr
	,N'Locali per oggetto di noleggio' AS FT_It
	,N'Комнаты по объекту аренды' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = '37812603-539b-407f-9f6c-2a8f514b3fde') 
-- FM_RaeumeNachMietobjekt


UNION


SELECT 
	 'e5e34680-b2b1-4a11-90b3-491ea2d09724' AS FT_UID
	,N'Flächi noch Miätobijäkt' AS FT_Ch
	,N'Fläche nach Mietobjekt' AS FT_De
	,N'Area by rental object' AS FT_En
	,N'Surface par objet de location' AS FT_Fr
	,N'Superficie per oggetto di noleggio' AS FT_It
	,N'Поверхность по объекту аренды' AS FT_Ru
	,N'' AS FT_Parameter
	,1 AS FT_Status
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Translation WHERE FT_UID = 'e5e34680-b2b1-4a11-90b3-491ea2d09724') 
-- FM_FlaecheNachMietobjekt
;

/*

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
;*/



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
	 'c0241400-a5b4-4c21-8f08-c3e7374a4ba0' AS NA_UID -- uniqueidentifier 
	,'f7f752be-6e86-4132-a984-8333fd23674d' AS NA_NA_UID -- Flächen 
	,'37812603-539b-407f-9f6c-2a8f514b3fde' AS NA_FT_UID -- uniqueidentifier 
	,'761092' AS NA_Color -- nvarchar(6) 
	,NULL AS NA_Frame -- nvarchar(20) 
	,NULL AS NA_Image -- nvarchar(100) 
	,'{@report}FM_RaeumeNachMietobjekt&proc={@proc}&in_sprache={@language}&rc:Stylesheet=COR_RS2012_v7' AS NA_Link -- nvarchar(400) 
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
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = 'c0241400-a5b4-4c21-8f08-c3e7374a4ba0' ) 
-- FM_RaeumeNachMietobjekt


UNION ALL 


SELECT 
	 '00dc4ef2-3078-40b0-a882-9e98d61b13ec' AS NA_UID -- uniqueidentifier 
	,'f7f752be-6e86-4132-a984-8333fd23674d' AS NA_NA_UID -- Flächen
	,'e5e34680-b2b1-4a11-90b3-491ea2d09724' AS NA_FT_UID -- uniqueidentifier 
	,'761092' AS NA_Color -- nvarchar(6) 
	,NULL AS NA_Frame -- nvarchar(20) 
	,NULL AS NA_Image -- nvarchar(100) 
	,'{@report}FM_FlaecheNachMietobjekt&proc={@proc}&in_sprache={@language}&rc:Stylesheet=COR_RS2012_v7' AS NA_Link -- nvarchar(400) 
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
WHERE 0 = (SELECT COUNT(*) FROM T_FMS_Navigation WHERE NA_UID = '00dc4ef2-3078-40b0-a882-9e98d61b13ec' ) 
;
