/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2022-03-17 11:41
**/

package data

type InfoAll struct {
	Stats        Stats        `json:"Stats"`
	Modules      Modules      `json:"Modules"`
	Cluster      Cluster      `json:"Cluster"`
	Server       Server       `json:"Server"`
	Clients      Clients      `json:"Clients"`
	Memory       Memory       `json:"Memory"`
	Persistence  Persistence  `json:"Persistence"`
	Keyspace     Keyspace     `json:"Keyspace"`
	Replication  Replication  `json:"Replication"`
	CPU          CPU          `json:"CPU"`
	Commandstats Commandstats `json:"Commandstats"`
	Errorstats   Errorstats   `json:"Errorstats"`
}

type Stats struct {
	IoThreadedReadsProcessed   string `json:"io_threaded_reads_processed"`
	InstantaneousOpsPerSec     string `json:"instantaneous_ops_per_sec"`
	TotalNetOutputBytes        string `json:"total_net_output_bytes"`
	PubsubChannels             string `json:"pubsub_channels"`
	MigrateCachedSockets       string `json:"migrate_cached_sockets"`
	ActiveDefragKeyHits        string `json:"active_defrag_key_hits"`
	TrackingTotalKeys          string `json:"tracking_total_keys"`
	TotalConnectionsReceived   string `json:"total_connections_received"`
	ExpiredTimeCapReachedCount string `json:"expired_time_cap_reached_count"`
	ActiveDefragKeyMisses      string `json:"active_defrag_key_misses"`
	TotalWritesProcessed       string `json:"total_writes_processed"`
	EvictedKeys                string `json:"evicted_keys"`
	KeyspaceHits               string `json:"keyspace_hits"`
	InstantaneousInputKbps     string `json:"instantaneous_input_kbps"`
	ExpiredKeys                string `json:"expired_keys"`
	SlaveExpiresTrackedKeys    string `json:"slave_expires_tracked_keys"`
	DumpPayloadSanitizations   string `json:"dump_payload_sanitizations"`
	IoThreadedWritesProcessed  string `json:"io_threaded_writes_processed"`
	TotalNetInputBytes         string `json:"total_net_input_bytes"`
	PubsubPatterns             string `json:"pubsub_patterns"`
	LatestForkUsec             string `json:"latest_fork_usec"`
	TotalForks                 string `json:"total_forks"`
	TrackingTotalItems         string `json:"tracking_total_items"`
	InstantaneousOutputKbps    string `json:"instantaneous_output_kbps"`
	RejectedConnections        string `json:"rejected_connections"`
	UnexpectedErrorReplies     string `json:"unexpected_error_replies"`
	TotalErrorReplies          string `json:"total_error_replies"`
	TrackingTotalPrefixes      string `json:"tracking_total_prefixes"`
	TotalCommandsProcessed     string `json:"total_commands_processed"`
	SyncFull                   string `json:"sync_full"`
	SyncPartialErr             string `json:"sync_partial_err"`
	ExpireCycleCPUMilliseconds string `json:"expire_cycle_cpu_milliseconds"`
	KeyspaceMisses             string `json:"keyspace_misses"`
	ActiveDefragMisses         string `json:"active_defrag_misses"`
	SyncPartialOk              string `json:"sync_partial_ok"`
	ExpiredStalePerc           string `json:"expired_stale_perc"`
	ActiveDefragHits           string `json:"active_defrag_hits"`
	TotalReadsProcessed        string `json:"total_reads_processed"`
}

type Modules struct {
}

type Cluster struct {
	ClusterEnabled string `json:"cluster_enabled"`
}

type Server struct {
	AtomicvarAPI      string `json:"atomicvar_api"`
	ProcessID         string `json:"process_id"`
	ServerTimeUsec    string `json:"server_time_usec"`
	UptimeInSeconds   string `json:"uptime_in_seconds"`
	IoThreadsActive   string `json:"io_threads_active"`
	RedisVersion      string `json:"redis_version"`
	Os                string `json:"os"`
	RunID             string `json:"run_id"`
	ConfigFile        string `json:"config_file"`
	RedisGitSha1      string `json:"redis_git_sha1"`
	ProcessSupervised string `json:"process_supervised"`
	TCPPort           string `json:"tcp_port"`
	UptimeInDays      string `json:"uptime_in_days"`
	ConfiguredHz      string `json:"configured_hz"`
	ArchBits          string `json:"arch_bits"`
	RedisBuildID      string `json:"redis_build_id"`
	RedisMode         string `json:"redis_mode"`
	MultiplexingAPI   string `json:"multiplexing_api"`
	GccVersion        string `json:"gcc_version"`
	Hz                string `json:"hz"`
	LruClock          string `json:"lru_clock"`
	Executable        string `json:"executable"`
	RedisGitDirty     string `json:"redis_git_dirty"`
}

type Clients struct {
	ClusterConnections          string `json:"cluster_connections"`
	Maxclients                  string `json:"maxclients"`
	ClientRecentMaxInputBuffer  string `json:"client_recent_max_input_buffer"`
	ClientRecentMaxOutputBuffer string `json:"client_recent_max_output_buffer"`
	BlockedClients              string `json:"blocked_clients"`
	TrackingClients             string `json:"tracking_clients"`
	ClientsInTimeoutTable       string `json:"clients_in_timeout_table"`
	ConnectedClients            string `json:"connected_clients"`
}

type Memory struct {
	AllocatorResident      string `json:"allocator_resident"`
	MemFragmentationBytes  string `json:"mem_fragmentation_bytes"`
	MemNotCountedForEvict  string `json:"mem_not_counted_for_evict"`
	MemClientsSlaves       string `json:"mem_clients_slaves"`
	UsedMemoryRssHuman     string `json:"used_memory_rss_human"`
	UsedMemoryPeakHuman    string `json:"used_memory_peak_human"`
	UsedMemoryPeakPerc     string `json:"used_memory_peak_perc"`
	MemReplicationBacklog  string `json:"mem_replication_backlog"`
	MemAllocator           string `json:"mem_allocator"`
	UsedMemory             string `json:"used_memory"`
	TotalSystemMemory      string `json:"total_system_memory"`
	AllocatorFragRatio     string `json:"allocator_frag_ratio"`
	UsedMemoryStartup      string `json:"used_memory_startup"`
	NumberOfCachedScripts  string `json:"number_of_cached_scripts"`
	AllocatorFragBytes     string `json:"allocator_frag_bytes"`
	MaxmemoryHuman         string `json:"maxmemory_human"`
	MemFragmentationRatio  string `json:"mem_fragmentation_ratio"`
	MemAofBuffer           string `json:"mem_aof_buffer"`
	UsedMemoryOverhead     string `json:"used_memory_overhead"`
	UsedMemoryLua          string `json:"used_memory_lua"`
	Maxmemory              string `json:"maxmemory"`
	ActiveDefragRunning    string `json:"active_defrag_running"`
	LazyfreePendingObjects string `json:"lazyfree_pending_objects"`
	UsedMemoryDataset      string `json:"used_memory_dataset"`
	AllocatorAllocated     string `json:"allocator_allocated"`
	MemClientsNormal       string `json:"mem_clients_normal"`
	RssOverheadBytes       string `json:"rss_overhead_bytes"`
	AllocatorActive        string `json:"allocator_active"`
	UsedMemoryScriptsHuman string `json:"used_memory_scripts_human"`
	AllocatorRssRatio      string `json:"allocator_rss_ratio"`
	UsedMemoryLuaHuman     string `json:"used_memory_lua_human"`
	AllocatorRssBytes      string `json:"allocator_rss_bytes"`
	RssOverheadRatio       string `json:"rss_overhead_ratio"`
	UsedMemoryRss          string `json:"used_memory_rss"`
	UsedMemoryPeak         string `json:"used_memory_peak"`
	TotalSystemMemoryHuman string `json:"total_system_memory_human"`
	MaxmemoryPolicy        string `json:"maxmemory_policy"`
	LazyfreedObjects       string `json:"lazyfreed_objects"`
	UsedMemoryHuman        string `json:"used_memory_human"`
	UsedMemoryDatasetPerc  string `json:"used_memory_dataset_perc"`
	UsedMemoryScripts      string `json:"used_memory_scripts"`
}

type Persistence struct {
	AofRewriteScheduled      string `json:"aof_rewrite_scheduled"`
	AofLastBgrewriteStatus   string `json:"aof_last_bgrewrite_status"`
	RdbCurrentBgsaveTimeSec  string `json:"rdb_current_bgsave_time_sec"`
	RdbLastCowSize           string `json:"rdb_last_cow_size"`
	AofRewriteInProgress     string `json:"aof_rewrite_in_progress"`
	AofCurrentRewriteTimeSec string `json:"aof_current_rewrite_time_sec"`
	AofLastWriteStatus       string `json:"aof_last_write_status"`
	RdbLastBgsaveTimeSec     string `json:"rdb_last_bgsave_time_sec"`
	CurrentCowSize           string `json:"current_cow_size"`
	CurrentForkPerc          string `json:"current_fork_perc"`
	CurrentSaveKeysProcessed string `json:"current_save_keys_processed"`
	RdbBgsaveInProgress      string `json:"rdb_bgsave_in_progress"`
	RdbLastSaveTime          string `json:"rdb_last_save_time"`
	AofLastCowSize           string `json:"aof_last_cow_size"`
	ModuleForkLastCowSize    string `json:"module_fork_last_cow_size"`
	Loading                  string `json:"loading"`
	CurrentSaveKeysTotal     string `json:"current_save_keys_total"`
	RdbChangesSinceLastSave  string `json:"rdb_changes_since_last_save"`
	RdbLastBgsaveStatus      string `json:"rdb_last_bgsave_status"`
	AofEnabled               string `json:"aof_enabled"`
	AofLastRewriteTimeSec    string `json:"aof_last_rewrite_time_sec"`
	ModuleForkInProgress     string `json:"module_fork_in_progress"`
	CurrentCowSizeAge        string `json:"current_cow_size_age"`
}

type Keyspace struct {
	Db0 string `json:"db0"`
	Db1 string `json:"db1"`
	Db2 string `json:"db2"`
}

type Replication struct {
	MasterReplid               string `json:"master_replid"`
	SecondReplOffset           string `json:"second_repl_offset"`
	ConnectedSlaves            string `json:"connected_slaves"`
	Slave0                     string `json:"slave0"`
	Slave1                     string `json:"slave1"`
	MasterReplOffset           string `json:"master_repl_offset"`
	ReplBacklogActive          string `json:"repl_backlog_active"`
	ReplBacklogSize            string `json:"repl_backlog_size"`
	ReplBacklogFirstByteOffset string `json:"repl_backlog_first_byte_offset"`
	ReplBacklogHistlen         string `json:"repl_backlog_histlen"`
	Role                       string `json:"role"`
	MasterFailoverState        string `json:"master_failover_state"`
	MasterReplid2              string `json:"master_replid2"`
}

type CPU struct {
	UsedCPUUserChildren string `json:"used_cpu_user_children"`
	UsedCPUSys          string `json:"used_cpu_sys"`
	UsedCPUUser         string `json:"used_cpu_user"`
	UsedCPUSysChildren  string `json:"used_cpu_sys_children"`
}

type CmdstatClient struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatLpush struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatPublish struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatZrange struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatXadd struct {
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
}

type CmdstatSubscribe struct {
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
}

type CmdstatKeys struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatHlen struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatHmset struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatSet struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatInfo struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatZscan struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatLrange struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatHset struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatExpire struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatTTL struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatZadd struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatDbsize struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatHscan struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatSrem struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatRestore struct {
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
}

type CmdstatPsync struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatSscan struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatXdel struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatPersist struct {
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
}

type CmdstatLset struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatLrem struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatAuth struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatRename struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatLlen struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatHdel struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatCommand struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatSelect struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatZrem struct {
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
}

type CmdstatZcard struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatType struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatXinfo struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatDel struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatScard struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatReplconf struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatSlowlog struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatSadd struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatDump struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatConfig struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatPsubscribe struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatHsetnx struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatScan struct {
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
}

type CmdstatXrevrange struct {
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
}

type CmdstatXread struct {
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
	Calls         string `json:"calls"`
}

type CmdstatPing struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type CmdstatGet struct {
	Calls         string `json:"calls"`
	Usec          string `json:"usec"`
	UsecPerCall   string `json:"usec_per_call"`
	RejectedCalls string `json:"rejected_calls"`
	FailedCalls   string `json:"failed_calls"`
}

type Commandstats struct {
	CmdstatClient     CmdstatClient     `json:"cmdstat_client"`
	CmdstatLpush      CmdstatLpush      `json:"cmdstat_lpush"`
	CmdstatPublish    CmdstatPublish    `json:"cmdstat_publish"`
	CmdstatZrange     CmdstatZrange     `json:"cmdstat_zrange"`
	CmdstatXadd       CmdstatXadd       `json:"cmdstat_xadd"`
	CmdstatSubscribe  CmdstatSubscribe  `json:"cmdstat_subscribe"`
	CmdstatKeys       CmdstatKeys       `json:"cmdstat_keys"`
	CmdstatHlen       CmdstatHlen       `json:"cmdstat_hlen"`
	CmdstatHmset      CmdstatHmset      `json:"cmdstat_hmset"`
	CmdstatSet        CmdstatSet        `json:"cmdstat_set"`
	CmdstatInfo       CmdstatInfo       `json:"cmdstat_info"`
	CmdstatZscan      CmdstatZscan      `json:"cmdstat_zscan"`
	CmdstatLrange     CmdstatLrange     `json:"cmdstat_lrange"`
	CmdstatHset       CmdstatHset       `json:"cmdstat_hset"`
	CmdstatExpire     CmdstatExpire     `json:"cmdstat_expire"`
	CmdstatTTL        CmdstatTTL        `json:"cmdstat_ttl"`
	CmdstatZadd       CmdstatZadd       `json:"cmdstat_zadd"`
	CmdstatDbsize     CmdstatDbsize     `json:"cmdstat_dbsize"`
	CmdstatHscan      CmdstatHscan      `json:"cmdstat_hscan"`
	CmdstatSrem       CmdstatSrem       `json:"cmdstat_srem"`
	CmdstatRestore    CmdstatRestore    `json:"cmdstat_restore"`
	CmdstatPsync      CmdstatPsync      `json:"cmdstat_psync"`
	CmdstatSscan      CmdstatSscan      `json:"cmdstat_sscan"`
	CmdstatXdel       CmdstatXdel       `json:"cmdstat_xdel"`
	CmdstatPersist    CmdstatPersist    `json:"cmdstat_persist"`
	CmdstatLset       CmdstatLset       `json:"cmdstat_lset"`
	CmdstatLrem       CmdstatLrem       `json:"cmdstat_lrem"`
	CmdstatAuth       CmdstatAuth       `json:"cmdstat_auth"`
	CmdstatRename     CmdstatRename     `json:"cmdstat_rename"`
	CmdstatLlen       CmdstatLlen       `json:"cmdstat_llen"`
	CmdstatHdel       CmdstatHdel       `json:"cmdstat_hdel"`
	CmdstatCommand    CmdstatCommand    `json:"cmdstat_command"`
	CmdstatSelect     CmdstatSelect     `json:"cmdstat_select"`
	CmdstatZrem       CmdstatZrem       `json:"cmdstat_zrem"`
	CmdstatZcard      CmdstatZcard      `json:"cmdstat_zcard"`
	CmdstatType       CmdstatType       `json:"cmdstat_type"`
	CmdstatXinfo      CmdstatXinfo      `json:"cmdstat_xinfo"`
	CmdstatDel        CmdstatDel        `json:"cmdstat_del"`
	CmdstatScard      CmdstatScard      `json:"cmdstat_scard"`
	CmdstatReplconf   CmdstatReplconf   `json:"cmdstat_replconf"`
	CmdstatSlowlog    CmdstatSlowlog    `json:"cmdstat_slowlog"`
	CmdstatSadd       CmdstatSadd       `json:"cmdstat_sadd"`
	CmdstatDump       CmdstatDump       `json:"cmdstat_dump"`
	CmdstatConfig     CmdstatConfig     `json:"cmdstat_config"`
	CmdstatPsubscribe CmdstatPsubscribe `json:"cmdstat_psubscribe"`
	CmdstatHsetnx     CmdstatHsetnx     `json:"cmdstat_hsetnx"`
	CmdstatScan       CmdstatScan       `json:"cmdstat_scan"`
	CmdstatXrevrange  CmdstatXrevrange  `json:"cmdstat_xrevrange"`
	CmdstatXread      CmdstatXread      `json:"cmdstat_xread"`
	CmdstatPing       CmdstatPing       `json:"cmdstat_ping"`
	CmdstatGet        CmdstatGet        `json:"cmdstat_get"`
}

type Errorstats struct {
	ErrorstatNOAUTH    string `json:"errorstat_NOAUTH"`
	ErrorstatWRONGTYPE string `json:"errorstat_WRONGTYPE"`
	ErrorstatERR       string `json:"errorstat_ERR"`
	ErrorstatLOADING   string `json:"errorstat_LOADING"`
}
