"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function incrementPlayCount(songId: string | number) {
  try {
    // Đoạn log này chỉ hiển thị trên Terminal của Server (VS Code), không lộ ra trình duyệt
    console.log(`\n[BACKEND SERVER ACTION] Đang xử lý tăng lượt nghe cho bài hát ID: ${songId}...`);
    
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    // 1. Lấy số lượt nghe hiện tại
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('play_count')
      .eq('id', songId)
      .single();

    if (fetchError) {
      console.error("[BACKEND ERROR] Không tìm thấy bài hát:", fetchError.message);
      return { success: false, error: fetchError.message };
    }

    const currentCount = song.play_count || 0;
    const newCount = currentCount + 1;

    // 2. Cập nhật lượt nghe mới
    const { error: updateError } = await supabase
      .from('songs')
      .update({ play_count: newCount })
      .eq('id', songId);

    if (updateError) {
      console.error("[BACKEND ERROR] Lỗi cập nhật Database:", updateError.message);
      return { success: false, error: updateError.message };
    }

    console.log(`[BACKEND SUCCESS] Cập nhật thành công! Bài hát ID ${songId} hiện có ${newCount} lượt nghe.\n`);
    return { success: true, newCount };

  } catch (error: any) {
    console.error("[BACKEND FATAL] Lỗi máy chủ:", error.message);
    return { success: false, error: error.message };
  }
}
