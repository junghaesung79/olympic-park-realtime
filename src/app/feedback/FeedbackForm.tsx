"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

function FormSection({
  id,
  title,
  description,
  placeholder,
}: {
  id: string;
  title: string;
  description: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim() || submitting) return;
    setSubmitting(true);

    try {
      const typeLabel = id === "correction-request" ? "정보 수정 요청" : "문의사항";
      const { error } = await supabase
        .from("feedbacks")
        .insert([{ type: typeLabel, content: value, status: "보류" }]);

      if (error) throw error;

      setSubmitted(true);
      setValue("");
    } catch (err: any) {
      alert("전송 실패: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          id={id}
          name={id}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitted(false);
          }}
          disabled={submitting}
          className="w-full resize-none rounded-md border border-zinc-300 bg-transparent p-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400 disabled:opacity-50"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-400 disabled:opacity-50"
          >
            {submitting ? "보내는 중..." : "보내기"}
          </button>
          {submitted && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              접수되었습니다. 확인 후 조치하겠습니다.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

export default function FeedbackForm() {
  return (
    <div className="flex flex-col gap-10">
      <FormSection
        id="correction-request"
        title="정보 수정 요청"
        description="사이트에 게시된 정보 중 사실과 다르거나 업데이트가 필요한 내용을 알려주세요."
        placeholder="어떤 정보를, 어떻게 수정해야 하는지 알려주세요"
      />
      <FormSection
        id="inquiry"
        title="문의사항"
        description="그 외 사이트 이용과 관련해 궁금한 점이나 제안하고 싶은 내용을 남겨주세요."
        placeholder="문의하실 내용을 입력해 주세요"
      />
    </div>
  );
}
