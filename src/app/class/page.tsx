import { getPublishedCourses } from "@/lib/queries";
import ClassPageClient from "./ClassPageClient";

export default async function ClassPage() {
    const courses = await getPublishedCourses();

    return <ClassPageClient courses={courses} />;
}
