import {Card, Chart} from "../component/Component";

const data = [
  { bgColor: "green-300", text: "black",iconColor:"green-600",  icon:"bi bi-person-fill", title: "Data siswa", description: "600" },
  { bgColor: "blue-300", text: "black", iconColor:"blue-600", icon:"bi bi-capsule", title: "Data obat", description: "876" },
  { bgColor: "yellow-300", text: "black", iconColor:"yellow-600", icon:"bi bi-card-list", title: "Daftar kunjungan", description: "364" },
  { bgColor: "red-300", text: "black", iconColor:"red-600", icon:"bi bi-envelope", title: "Data surat", description: "534" }
];

function Home(){
    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className={`grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 justify-items-center gap-4`}>
                {data.map((item, idx) => (
                    <Card
                    key={idx}
                    bgColor={item.bgColor}
                    text={item.text}
                    icon={item.icon}
                    iconColor={item.iconColor}
                    title={item.title}
                    description={item.description}
                    />
                ))}
            </div>
            <Chart/>
        </div>
    );
}
export default Home;