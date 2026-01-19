import { getPublishedCourses } from "@/lib/queries";
import ClassPageClient from "./ClassPageClient";

import { ListViewTracker } from "@/components/ListViewTracker";

export default async function ClassPage() {
    const courses = await getPublishedCourses();

    return (
        <>
            <ListViewTracker eventName="view_class_list" />
            <ClassPageClient courses={courses} />
        </>
    );
}
