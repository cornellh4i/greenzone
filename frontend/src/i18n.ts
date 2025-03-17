import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: "Green Zone",
        description: "GreenZone aims to create a Carrying Capacity Early Warning System for Mongolian rangelands to combat degradation caused by overgrazing and climate change.\n\n" +
          "Mongolia's rangelands, vital to 300,000 herders and 71 million livestock, have seen significant degradation, with 58% affected due to overgrazing. Climate change further worsens conditions, causing extreme weather events like dzud, which lead to livestock mortality and increased poverty.\n\n" +
          "GreenZone uses ground-truth biomass data and remote sensing vegetation indices to monitor rangeland health in near-real-time, helping herders and officials make informed decisions about rangeland management.\n\n" +
          "This system aims to prevent overexploitation, promote sustainable practices, and improve food security and poverty among herding communities.",
      },
    },
    mn: {
      translation: {
        title: "Ногоон бүс",
        description: "Ногоон бүс нь бэлчээрийн даац хэтэрч, уур амьсгалын өөрчлөлтөөс үүдэлтэй доройтолтой тэмцэхийн тулд Монголын бэлчээрийн даацыг эрт зарлан мэдээлэх системийг бий болгох зорилготой.\n\n" +
          "Монгол Улсын 300 мянган малчин, 71 сая толгой мал аж ахуй эрхэлдэг бэлчээрийн талхагдал ихээхэн доройтож, 58 хувь нь бэлчээрийн даац хэтэрсэний улмаас хохирсон. Уур амьсгалын өөрчлөлт нь нөхцөл байдлыг улам дордуулж, зуд зэрэг цаг агаарын эрс тэс үзэгдэл болж, улмаар малын хорогдол, ядуурал нэмэгдсээр байна.\n\n" +
          "GreenZone нь газрын бодит биомассын өгөгдөл болон зайнаас тандан судлах ургамлын индексийг ашиглан бэлчээрийн эрүүл мэндийг цаг алдалгүй хянаж, малчид болон албаны хүмүүст бэлчээрийн менежментийн талаар мэдээлэлтэй шийдвэр гаргахад тусалдаг.\n\n" +
          "Энэ систем нь хэт мөлжлөгөөс урьдчилан сэргийлэх, тогтвортой үйл ажиллагааг дэмжих, малчдын дунд хүнсний аюулгүй байдал, ядуурлыг сайжруулах зорилготой юм."
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
