/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-19 10:12
**/

package app

import (
	"sync"

	"server/data"
)

//
// type KeyList struct {
// 	sync.RWMutex
// 	list map[string]struct{}
// }
//
// func NewKeyList() *KeyList {
// 	return &KeyList{
// 		list: make(map[string]struct{}),
// 	}
// }
//
// func (k *KeyList) Get() []string {
// 	k.RLock()
// 	defer k.RUnlock()
// 	keys := make([]string, 0, len(k.list))
// 	for key := range k.list {
// 		keys = append(keys, key)
// 	}
// 	return keys
// }
//
// func (k *KeyList) Set(key string) {
// 	k.Lock()
// 	defer k.Unlock()
// 	k.list[key] = struct{}{}
// }
//
// func (k *KeyList) Delete(key string) {
// 	k.Lock()
// 	defer k.Unlock()
// 	delete(k.list, key)
// }

// func NewDB() *DB {
// 	return &DB{
// 		data: make(map[string]*KeyList),
// 	}
// }

// type DB struct {
// 	data map[string]*KeyList
// 	mux  sync.RWMutex
// }
//
// func (d *DB) Set(key string, value *KeyList) {
// 	d.mux.Lock()
// 	defer d.mux.Unlock()
// 	d.data[key] = value
// }
//
// func (d *DB) Get(key string) *KeyList {
// 	d.mux.RLock()
// 	defer d.mux.RUnlock()
// 	return d.data[key]
// }

// func (d *DB) Delete(key string) {
// 	d.mux.Lock()
// 	defer d.mux.Unlock()
// 	delete(d.data, key)
// }

type DataList struct {
	mux  sync.RWMutex
	data map[int]map[string]*data.Data
}

func NewDataList() *DataList {
	return &DataList{
		data: make(map[int]map[string]*data.Data),
	}
}

func (d *DataList) Set(db int, uuid string, value *data.Data) {
	d.mux.Lock()
	defer d.mux.Unlock()

	var res = d.data[db]
	if res == nil {
		res = make(map[string]*data.Data)
		d.data[db] = res
	}

	res[uuid] = value
}

func (d *DataList) Lock() {
	d.mux.Lock()
}

func (d *DataList) Unlock() {
	d.mux.Unlock()
}

func (d *DataList) GetDataByDB(db int) map[string]*data.Data {
	return d.data[db]
}

func (d *DataList) Get(db int, uuid string) *data.Data {
	d.mux.Lock()
	defer d.mux.Unlock()

	var res = d.data[db]
	if res == nil {
		return nil
	}

	return res[uuid]
}

func (d *DataList) DeleteDB(db int) {
	d.mux.Lock()
	defer d.mux.Unlock()
	delete(d.data, db)
}

func (d *DataList) DeleteUUID(db int, uuid string) {
	d.mux.Lock()
	defer d.mux.Unlock()

	var res = d.data[db]
	if res == nil {
		return
	}

	delete(res, uuid)
}
