CREATE TABLE playlist_videos (
  playlistId UUID REFERENCES playlists(id) ON DELETE CASCADE,
  videoId UUID REFERENCES videos(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (playlistId, videoId)
);
