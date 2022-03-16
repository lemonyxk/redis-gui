/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-18 01:16
**/

package app

var (
	// DataMap
	// Databases   = NewDB()
	DataMap     = NewDataList()
	Connections = NewConn()
	Server      *WebSocket
)
