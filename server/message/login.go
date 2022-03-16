/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 10:28
**/

package message

type Login struct {
	Name  string `json:"name"`
	Split string `json:"split"`
	DB    int    `json:"db"`
	// cluster sentinel client
	Type       string   `json:"type"`
	MasterName string   `json:"master_name"`
	Password   string   `json:"password"`
	Addr       []string `json:"addr"`
}
