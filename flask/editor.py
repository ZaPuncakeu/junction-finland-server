from moviepy.editor import VideoFileClip, concatenate_videoclips, vfx, AudioFileClip, afx, CompositeAudioClip
from youtube import get_youtube_video
import os
from pytube import Playlist
import random
def get_music_video(idv):
    path = f"../server/public/videos/{idv}/"
    playlist = Playlist('https://www.youtube.com/watch?v=16LGG9JYhA8&list=PLyXUGQy5iOfVpBK_YugXyiKGe5KYnwcMb    ')
    rand_music = random.randint(0, len(playlist.videos))
    playlist.videos[rand_music].streams.filter(only_audio=True).first().download(path)
    return path+os.listdir(path)[0]

def edit_videos(idv, files):
    os.mkdir(f'../server/public/videos/{idv}')
    
    audio_path = get_music_video(idv)
    clips = [VideoFileClip(file).subclip(10, 15).resize((460,720)) for file in files]
    
    audio = AudioFileClip(audio_path).subclip(10, (len(clips) * 5) + 10).fx(afx.audio_fadein, 0.5)
    combined = concatenate_videoclips(clips)
    combined.audio = CompositeAudioClip([audio])

    combined.write_videofile(f"../server/public/videos/{idv}/{idv}.mp4")
    audio.close()
    
    os.remove(audio_path)
    for i in range(len(files)):
        clips[i].close()
        if os.path.exists(files[i]):
            os.remove(files[i])
        else:
            print("The file does not exist")

    video = f'http://127.0.0.1:4001/videos/{idv}/{idv}.mp4'
    return video


def get_play_video(link):
    path = f"./downloaded_videos/"
    playlist = Playlist(link)
    for v in playlist.videos:
        v.streams.filter(file_extension='mp4').first().download(path)

