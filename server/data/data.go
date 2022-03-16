/**
* @program: redis-gui
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-16 04:01
**/

package data

import (
	"strings"

	tm "github.com/liyue201/gostl/ds/map"
)

type Tire struct {
	Parent   *Tire   `json:"-"`
	Children *tm.Map `json:"-"`
	Info
}

type Info struct {
	Size  int
	Name  string
	Path  string
	IsDir bool
	IsKey bool
}

type Data struct {
	root  *Tire
	split string
}

func NewMap() *tm.Map {
	return tm.New(tm.WithGoroutineSafe())
}

func NewData(split string) *Data {
	return &Data{root: &Tire{Children: NewMap(), Info: Info{IsDir: true}}, split: split}
}

func (d *Data) Get(path string, page int, limit int) []Info {

	var nodes []Info

	var offset = (page - 1) * limit

	var index = 0

	if path == "" {
		d.root.Children.Traversal(func(key, value interface{}) bool {
			if index >= offset && index <= offset+limit-1 {
				var v = value.(*Tire)

				if v.IsDir {
					v.Size = v.Children.Size()
					nodes = append(nodes, Info{Name: v.Name, Path: v.Path, IsDir: true, IsKey: false, Size: v.Size})
				}

				if v.IsKey {
					nodes = append(nodes, Info{Name: v.Name, Path: v.Path, IsDir: false, IsKey: true, Size: v.Size})
				}

			}
			index++
			return true
		})
		return nodes
	}

	var res []string
	if d.split == "" {
		res = []string{path}
	} else {
		res = strings.Split(path, d.split)
	}

	var node = d.root

	for i := 0; i < len(res); i++ {

		if node.Children != nil {
			var n = node.Children.Get(res[i])
			if n != nil {
				node = n.(*Tire)
			} else {
				return nil
			}
		}

		if i == len(res)-1 {
			if node.IsDir {
				node.Children.Traversal(func(key, value interface{}) bool {
					if index >= offset && index <= offset+limit-1 {
						var v = value.(*Tire)
						if v.IsDir {
							v.Size = v.Children.Size()
							nodes = append(nodes, Info{Name: v.Name, Path: v.Path, IsDir: true, IsKey: false, Size: v.Size})
						}
						if v.IsKey {
							nodes = append(nodes, Info{Name: v.Name, Path: v.Path, IsDir: false, IsKey: true, Size: v.Size})
						}
					}
					index++
					return true
				})
			}
		}
	}

	return nodes
}

func (d *Data) Insert(path string) {
	var res []string
	if d.split == "" {
		res = []string{path}
	} else {
		res = strings.Split(path, d.split)
	}

	var l = len(res)

	if l == 0 {
		return
	}

	var node = d.root

	for i := 0; i < l; i++ {
		if node.Children == nil {
			node.Children = NewMap()
		}

		var p = strings.Join(res[:i+1], d.split)

		var child = node.Children.Get(res[i])
		if child == nil {
			child = &Tire{Info: Info{Name: res[i], IsDir: i != l-1, IsKey: i == l-1, Path: p}, Parent: node}
			node.Children.Insert(res[i], child)
		} else {
			if i == l-1 {
				child.(*Tire).IsKey = true
			} else {
				child.(*Tire).IsDir = true
			}
		}

		node = child.(*Tire)
	}
}

func (d *Data) Delete(path string) {
	if path == "" {
		d.root.Children.Clear()
		return
	}

	var res []string
	if d.split == "" {
		res = []string{path}
	} else {
		res = strings.Split(path, d.split)
	}

	var node = d.root

	for i := 0; i < len(res); i++ {
		if node.Children != nil {
			var n = node.Children.Get(res[i])
			if n != nil {
				node = n.(*Tire)
			} else {
				return
			}
		}

		if i == len(res)-1 {
			if node.IsDir {
				node.IsKey = false
			} else {
				var parent = node.Parent
				var name = node.Name
				for {
					parent.Children.Erase(name)
					if parent.Children.Size() == 0 {
						name = parent.Name
						parent = parent.Parent
					} else {
						break
					}
				}
			}
		}
	}
}

func (d *Data) Scan(count int) []Info {
	var res []Info
	d.scan(d.root, &res, count)
	return res
}

func (d *Data) scan(node *Tire, res *[]Info, count int) {
	node.Children.Traversal(func(key, value interface{}) bool {
		var n = value.(*Tire)

		if n.IsDir {
			if n.IsKey {
				*res = append(*res, n.Info)
			}
			d.scan(n, res, count)
		} else {
			if len(*res) > count-1 && count != -1 {
				return false
			} else {
				*res = append(*res, n.Info)
			}
		}
		return true
	})
}
