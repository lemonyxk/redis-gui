/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-03-16 18:46
**/

package websocket

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/lemoyxk/console"
	pty "github.com/runletapp/go-console"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebsocket(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	proc, err := pty.New(80, 24)
	if err != nil {
		panic(err)
	}

	var args []string

	cmd := exec.Command("/bin/bash", "-l")
	cmd.Env = append(os.Environ(), "TERM=xterm")

	if runtime.GOOS == "windows" {
		args = []string{"cmd.exe", "-l"}
	} else {
		args = []string{"/bin/bash", "-l"}
	}

	proc.SetENV(append(os.Environ(), "TERM=xterm"))

	if err := proc.Start(args); err != nil {
		panic(err)
	}

	defer func() {
		proc.Close()
		conn.Close()
	}()

	// defer current.Reset()
	//
	//
	// if err := current.SetRaw(); err != nil {
	// 	log.Println(err)
	// 	return
	// }
	//
	// ws, err := current.Size()

	// current.Resize(ws)

	go func() {
		for {
			buf := make([]byte, 1024)
			read, err := proc.Read(buf)
			if err != nil {
				conn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
				console.Error(err)
				return
			}
			conn.WriteMessage(websocket.BinaryMessage, buf[:read])
		}
	}()

	var size Size

	for {
		_, reader, err := conn.NextReader()
		if err != nil {
			console.Error(err)
			return
		}

		bts, err := ioutil.ReadAll(reader)
		if err != nil {
			console.Error(err)
			return
		}

		err = json.Unmarshal(bts, &size)
		if err == nil {
			proc.SetSize(size.Cols, size.Rows)
			continue
		}

		// var buf  = bytes.NewReader(bts)
		proc.Write(bts)

		// _, err = io.Copy(proc, buf)
		// if err != nil {
		// 	console.Error(err)
		// }
	}
}

type Size struct {
	Cols int `json:"cols"`
	Rows int `json:"rows"`
}

func PTY() {

	flag.Parse()

	r := mux.NewRouter()

	r.HandleFunc("/", handleWebsocket)

	go console.Info(http.ListenAndServe("127.0.0.1:8669", r))
}
