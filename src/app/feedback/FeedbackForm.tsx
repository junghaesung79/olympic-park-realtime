"use client";

import { useState, type FormEvent } from "react";

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitted(true);
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
          className="w-full rounded-md border border-zinc-300 bg-transparent p-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-400"
          >
            제출하기
          </button>
          {submitted && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              접수되었습니다. 검토 후 반영하겠습니다. (전송 기능은 추후 연동
              예정입니다)
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
