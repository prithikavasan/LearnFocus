function Settings({ course, setCourse }) {
  return (
    <div className="space-y-4">
      <input
        placeholder="Course Duration (e.g. 6 weeks)"
        className="w-full border p-3 rounded-xl"
        value={course.duration}
        onChange={(e) =>
          setCourse({ ...course, duration: e.target.value })
        }
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={course.isPublic}
          onChange={(e) =>
            setCourse({ ...course, isPublic: e.target.checked })
          }
        />
        Make course public
      </label>
      <select
  value={course.level}
  onChange={(e) => setCourse({ ...course, level: e.target.value })}
  className="w-full border p-3 rounded-xl"
>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>

    </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  );
}

export default Settings;
