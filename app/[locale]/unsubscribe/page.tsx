import { getTranslations } from "next-intl/server";

export default async function UnsubscribePage() {
  const t = await getTranslations("UnsubscribePage");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
    </div>
  );
}
