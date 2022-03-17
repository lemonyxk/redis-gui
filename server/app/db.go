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
