/**
* @program: redis-gui
*
* @description:
*
* @author: lemo
*
* @create: 2022-02-16 16:41
**/

package test

import (
	"fmt"
	"testing"

	treemap "github.com/liyue201/gostl/ds/map"
	"github.com/stretchr/testify/assert"
)

func BenchmarkMap(b *testing.B) {
	m := treemap.New(treemap.WithGoroutineSafe())
	m.Insert("a", "aaa")
	for i := 0; i < b.N; i++ {
		m.Get("a")
	}
}

func Test_Map(t *testing.T) {
	m := treemap.New(treemap.WithGoroutineSafe())

	m.Insert("a", "aaa")
	m.Insert("b", "bbb")

	fmt.Printf("a = %v\n", m.Get("a"))
	fmt.Printf("b = %v\n", m.Get("b"))

	m.Erase("b")

	assert.True(t, 1 == 1)
}
